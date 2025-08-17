import os
import io
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List

import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

                   
def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    small_csv_path = os.path.join(base_dir, "demo_data_small.csv")
    medium_csv_path = os.path.join(base_dir, "demo_data_medium.csv")
    config_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config")

    # Load config files (rules, faqs, users)
    def load_json_safe(path: str, default: Any) -> Any:
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default

    rules_config = load_json_safe(os.path.join(config_dir, "rules.json"), default={"rules": []})
    faqs_config = load_json_safe(os.path.join(config_dir, "faqs.json"), default={"faqs": []})
    users_config = load_json_safe(os.path.join(config_dir, "users.json"), default={"users": []})

    # Load CSVs lazily when needed to allow hot reload without re-reading on import
    def read_medium_csv() -> pd.DataFrame:
        df = pd.read_csv(medium_csv_path)
        # Normalize column names
        df.columns = [c.strip() for c in df.columns]
        if "order_date" in df.columns:
            df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
        return df

    def read_small_csv() -> pd.DataFrame:
        df = pd.read_csv(small_csv_path)
        df.columns = [c.strip() for c in df.columns]
        if "OrderDate" in df.columns:
            df["OrderDate"] = pd.to_datetime(df["OrderDate"], errors="coerce")
        return df

    def filter_by_window(df: pd.DataFrame, date_col: str, days: int) -> pd.DataFrame:
        if date_col not in df.columns or df[date_col].isna().all():
            return df
        max_date = df[date_col].max()
        if pd.isna(max_date):
            return df
        start_date = max_date - timedelta(days=days)
        return df[df[date_col] >= start_date]

    def compute_aggregated_metrics(df: pd.DataFrame) -> Dict[str, Any]:
        # Simulated mappings to align with PRD nomenclature
        total_orders = len(df)
        total_quantity = df["quantity"].sum() if "quantity" in df.columns else df.get("UnitsSold", pd.Series(dtype=float)).sum()
        revenue = df.get("final_amount", df.get("Revenue", pd.Series(dtype=float))).sum()
        unique_customers = df["customer_id"].nunique() if "customer_id" in df.columns else df.get("Location", pd.Series(dtype=str)).nunique()
        impressions = int((total_quantity if pd.notna(total_quantity) else total_orders) * 120)
        reach = int(unique_customers) if pd.notna(unique_customers) else max(1, total_orders // 2)
        frequency = round(impressions / reach, 2) if reach else 0
        conversions = int(total_orders)
        cost = revenue * 0.6 if revenue else total_quantity * 10
        cpc = round(cost / conversions, 2) if conversions else 0
        conv_rate = round(conversions / impressions, 4) if impressions else 0
        roas = round(revenue / cost, 2) if cost else None
        return {
            "impressions": impressions,
            "reach": reach,
            "frequency": frequency,
            "conversions": conversions,
            "revenue": round(float(revenue), 2) if revenue else 0,
            "cost": round(float(cost), 2) if cost else 0,
            "cpc": cpc,
            "conversion_rate": conv_rate,
            "roas": roas,
            "simulated": True,
        }

    def compute_scatter(df: pd.DataFrame) -> List[Dict[str, Any]]:
        # Group by a proxy for campaigns: product_category if present, else ProductCategory
        if "product_category" in df.columns:
            group_col = "product_category"
        elif "ProductCategory" in df.columns:
            group_col = "ProductCategory"
        else:
            group_col = None
        records: List[Dict[str, Any]] = []
        if group_col is None:
            metrics = compute_aggregated_metrics(df)
            records.append({
                "campaign": "All",
                "cost_per_conversion": metrics["cpc"],
                "conversion_rate": metrics["conversion_rate"],
            })
            return records
        for campaign, g in df.groupby(group_col):
            orders = len(g)
            quantity = g["quantity"].sum() if "quantity" in g.columns else g.get("UnitsSold", pd.Series(dtype=float)).sum()
            revenue = g.get("final_amount", g.get("Revenue", pd.Series(dtype=float))).sum()
            impressions = int((quantity if pd.notna(quantity) else orders) * 120)
            conversions = int(orders)
            cost = revenue * 0.6 if revenue else quantity * 10
            cpc = round(cost / conversions, 2) if conversions else 0
            conv_rate = round(conversions / impressions, 4) if impressions else 0
            records.append({
                "campaign": str(campaign),
                "cost_per_conversion": cpc,
                "conversion_rate": conv_rate,
            })
        return records

    def compute_pivot(df: pd.DataFrame) -> List[Dict[str, Any]]:
        # Pivot-like aggregation by region and product_category
        region_col = "region" if "region" in df.columns else ("Location" if "Location" in df.columns else None)
        category_col = "product_category" if "product_category" in df.columns else ("ProductCategory" if "ProductCategory" in df.columns else None)
        amount_col = "final_amount" if "final_amount" in df.columns else ("Revenue" if "Revenue" in df.columns else None)
        if not all([region_col, category_col, amount_col]):
            return []
        grouped = df.groupby([region_col, category_col]).agg({amount_col: "sum"}).reset_index()
        grouped.columns = ["region", "category", "revenue"]
        grouped["revenue"] = grouped["revenue"].round(2)
        return grouped.to_dict(orient="records")

    def generate_recommendations(df: pd.DataFrame, limit: int) -> List[Dict[str, Any]]:
        scatter = compute_scatter(df)
        recs: List[Dict[str, Any]] = []
        for item in scatter:
            action = "Decrease Bids" if item["cost_per_conversion"] > 500 else "Increase Budget"
            benefit = f"Predicted ROAS +{round(0.05 if action == 'Increase Budget' else 0.08, 2)}"
            explanation = f"Based on CPC={item['cost_per_conversion']} and CVR={item['conversion_rate']}, {action.lower()} is expected to improve efficiency."
            recs.append({
                "id": f"rec-{item['campaign'].lower().replace(' ', '-')}",
                "campaign": item["campaign"],
                "action": action,
                "benefit": benefit,
                "explanation": explanation,
                "simulated": True,
            })
        # Apply optional config-based overrides
        for r in rules_config.get("rules", []):
            recs.append({
                "id": r.get("id", f"rule-{len(recs)+1}"),
                "campaign": r.get("campaign", "All"),
                "action": r.get("action", "Increase Budget"),
                "benefit": r.get("benefit", "Predicted ROAS +0.05"),
                "explanation": r.get("explanation", "Rule-based recommendation"),
                "simulated": True,
            })
        # Deduplicate by id keeping first
        unique = {}
        for x in recs:
            unique.setdefault(x["id"], x)
        return list(unique.values())[:limit]

    @app.route("/api/health", methods=["GET"])
    def health() -> Any:
        return jsonify({"status": "ok"})

    @app.route("/api/login", methods=["POST"])
    def login() -> Any:
        body = request.get_json(silent=True) or {}
        username = body.get("username", "").strip()
        password = body.get("password", "").strip()
        for u in users_config.get("users", []):
            if u.get("username") == username and u.get("password") == password:
                return jsonify({
                    "token": f"demo-token-{username}",
                    "name": u.get("name", username),
                    "email": u.get("email", "")
                })
        return jsonify({"error": "Invalid credentials"}), 401

    @app.route("/api/metrics", methods=["GET"])
    def metrics() -> Any:
        window = int(request.args.get("window", 30))
        df = read_medium_csv()
        df = filter_by_window(df, "order_date", window)
        agg = compute_aggregated_metrics(df)
        return jsonify(agg)

    @app.route("/api/scatter", methods=["GET"])
    def scatter() -> Any:
        window = int(request.args.get("window", 30))
        df = read_medium_csv()
        df = filter_by_window(df, "order_date", window)
        return jsonify({"points": compute_scatter(df), "simulated": True})

    @app.route("/api/pivot", methods=["GET"])
    def pivot() -> Any:
        window = int(request.args.get("window", 30))
        df = read_medium_csv()
        df = filter_by_window(df, "order_date", window)
        return jsonify({"rows": compute_pivot(df), "simulated": True})

    @app.route("/api/recommendations", methods=["GET"]) 
    def recommendations() -> Any:
        limit = int(request.args.get("limit", 3))
        df = read_medium_csv()
        recs = generate_recommendations(df, limit=limit)
        return jsonify({"items": recs})

    @app.route("/api/recommendations/apply", methods=["POST"]) 
    def apply_recommendations() -> Any:
        body = request.get_json(silent=True) or {}
        selected = body.get("ids", [])
        return jsonify({"applied": selected, "simulated": True})

    @app.route("/api/recommendations/export", methods=["GET"]) 
    def export_presentation() -> Any:
        df = read_medium_csv()
        agg = compute_aggregated_metrics(df)
        recs = generate_recommendations(df, limit=10)
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            pd.DataFrame([agg]).to_excel(writer, index=False, sheet_name="Metrics")
            pd.DataFrame(recs).to_excel(writer, index=False, sheet_name="Recommendations")
        output.seek(0)
        return send_file(
            output,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            as_attachment=True,
            download_name="presentation_data.xlsx",
        )

    @app.route("/api/chat", methods=["POST"]) 
    def chat() -> Any:
        body = request.get_json(silent=True) or {}
        message = (body.get("message") or "").strip().lower()
        for item in faqs_config.get("faqs", []):
            q = (item.get("q") or "").strip().lower()
            if q and (q in message or message in q):
                return jsonify({
                    "answer": item.get("a", ""),
                    "source": "faq",
                    "simulated": True
                })
        # OpenAI optional: disabled by default to avoid extra dependency
        if os.environ.get("OPENAI_API_KEY"):
            return jsonify({
                "answer": "OpenAI integration available but not enabled in this build.",
                "source": "openai-available",
                "simulated": False
            })
        return jsonify({
            "answer": "not data simulated: canned response not found.",
            "source": "none",
            "simulated": False
        })

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=True)


