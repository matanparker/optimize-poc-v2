var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// netlify/functions/utils.js
var require_utils = __commonJS({
  "netlify/functions/utils.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };
    function createResponse2(data, statusCode = 200) {
      return {
        statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };
    }
    function parseCSV(csvText) {
      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        data.push(row);
      }
      return data;
    }
    function loadCSVData2() {
      try {
        const projectRoot = path.resolve(__dirname, "../../");
        const mediumCSVPath = path.join(projectRoot, "demo_data_medium.csv");
        const smallCSVPath = path.join(projectRoot, "demo_data_small.csv");
        const mediumCSV = fs.readFileSync(mediumCSVPath, "utf8");
        const smallCSV = fs.readFileSync(smallCSVPath, "utf8");
        const mediumData = parseCSV(mediumCSV);
        const smallData = parseCSV(smallCSV);
        return { mediumData, smallData };
      } catch (error) {
        console.error("Error loading CSV data:", error);
        return { mediumData: [], smallData: [] };
      }
    }
    function filterByWindow(data, dateColumn, days) {
      if (!data || data.length === 0)
        return [];
      const now = /* @__PURE__ */ new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1e3);
      const filteredData = data.filter((row) => {
        const dateStr = row[dateColumn];
        if (!dateStr)
          return true;
        const rowDate = new Date(dateStr);
        return !isNaN(rowDate.getTime()) && rowDate >= startDate;
      });
      if (filteredData.length === 0) {
        console.log(`No data found in ${days}-day window, returning all data for demo`);
        return data;
      }
      return filteredData;
    }
    function computeMetrics2(data) {
      if (!data || data.length === 0) {
        return {
          impressions: 0,
          reach: 0,
          frequency: 0,
          conversions: 0,
          revenue: 0,
          cost: 0,
          cpc: 0,
          conversion_rate: 0,
          roas: 0,
          simulated: true
        };
      }
      const totalOrders = data.length;
      const totalQuantity = data.reduce((sum, row) => {
        const qty = parseFloat(row.quantity) || parseFloat(row.UnitsSold) || 1;
        return sum + qty;
      }, 0);
      const revenue = data.reduce((sum, row) => {
        const amt = parseFloat(row.final_amount) || parseFloat(row.Revenue) || 0;
        return sum + amt;
      }, 0);
      const uniqueCustomers = new Set(data.map((row) => row.customer_id || row.Location)).size;
      const impressions = Math.floor(totalQuantity * 120);
      const reach = Math.max(1, uniqueCustomers || Math.floor(totalOrders / 2));
      const frequency = Math.round(impressions / reach * 100) / 100;
      const conversions = totalOrders;
      const cost = revenue * 0.6;
      const cpc = Math.round(cost / conversions * 100) / 100;
      const conversionRate = Math.round(conversions / impressions * 1e4) / 1e4;
      const roas = cost > 0 ? Math.round(revenue / cost * 100) / 100 : 0;
      return {
        impressions,
        reach,
        frequency,
        conversions,
        revenue: Math.round(revenue * 100) / 100,
        cost: Math.round(cost * 100) / 100,
        cpc,
        conversion_rate: conversionRate,
        roas,
        simulated: true
      };
    }
    var mockUsers = [
      { username: "demo", password: "demo", name: "Demo User", email: "demo@example.com" }
    ];
    var mockFAQs = [
      {
        q: "What are the top factors driving the highest conversion rates?",
        a: "Top drivers: product category 'Electronics', regions 'Europe' and 'Asia Pacific', and orders with quantity > 5. Increase budget on high CVR segments."
      },
      {
        q: "Which campaigns are underperforming against benchmark?",
        a: "Campaigns with CPC > 500 and CVR < 0.01 are below benchmark. Consider decreasing bids or reallocating budget."
      },
      {
        q: "Show me the executive summary for the last 14 days",
        a: "Impressions ~1.2M, Reach ~35k, Frequency 3.2, Conversions 1.1k, ROAS 1.6. Top recs: Increase Budget for Electronics, Decrease Bids for General."
      }
    ];
    var mockRules2 = [
      {
        id: "rule-boost-electronics",
        campaign: "Electronics",
        action: "Increase Budget",
        benefit: "Predicted ROAS +0.06",
        explanation: "Electronics category shows strong CVR; increasing budget can scale results."
      },
      {
        id: "rule-trim-general",
        campaign: "General",
        action: "Decrease Bids",
        benefit: "Predicted CPA -8%",
        explanation: "High CPC detected relative to conversions; trim bids to improve efficiency."
      }
    ];
    module2.exports = {
      corsHeaders,
      createResponse: createResponse2,
      parseCSV,
      loadCSVData: loadCSVData2,
      filterByWindow,
      computeMetrics: computeMetrics2,
      mockUsers,
      mockFAQs,
      mockRules: mockRules2
    };
  }
});

// netlify/functions/recommendations.js
var { createResponse, loadCSVData, computeMetrics, mockRules } = require_utils();
function generateDataRecommendations(data) {
  const groups = {};
  data.forEach((row) => {
    const category = row.product_category || row.ProductCategory || "Unknown";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(row);
  });
  const recommendations = [];
  Object.entries(groups).forEach(([category, categoryData]) => {
    const metrics = computeMetrics(categoryData);
    if (metrics.cpc > 500) {
      recommendations.push({
        id: `rec-${category.toLowerCase().replace(/\s+/g, "-")}-decrease`,
        campaign: category,
        action: "Decrease Bids",
        benefit: "Predicted ROAS +0.08",
        explanation: `High CPC detected (${metrics.cpc}). Decreasing bids expected to improve efficiency.`
      });
    } else if (metrics.conversion_rate > 0.01) {
      recommendations.push({
        id: `rec-${category.toLowerCase().replace(/\s+/g, "-")}-increase`,
        campaign: category,
        action: "Increase Budget",
        benefit: "Predicted ROAS +0.05",
        explanation: `Strong CVR (${metrics.conversion_rate}) detected. Increasing budget can scale results.`
      });
    }
  });
  return recommendations;
}
exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return createResponse({});
  }
  try {
    const limit = parseInt(event.queryStringParameters?.limit || "10");
    const { mediumData } = loadCSVData();
    const dataRecs = generateDataRecommendations(mediumData);
    const allRecs = [...dataRecs, ...mockRules];
    const items = allRecs.slice(0, limit).map((rec) => ({
      ...rec,
      simulated: true
    }));
    return createResponse({ items });
  } catch (error) {
    console.error("Error in recommendations function:", error);
    return createResponse({ error: "Internal server error" }, 500);
  }
};
//# sourceMappingURL=recommendations.js.map
