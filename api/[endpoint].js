import axios from 'axios';

const BASE_URL = "http://140.245.5.226:";

const handler = async (req, res) => {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // ✅ Handle preflight
  }

  const fullUrl = new URL(req.url, `http://${req.headers.host}`);
  const endpoint = fullUrl.pathname.split("/").pop();
  const method = req.method.toLowerCase();

  const urlMap = {
    "server-status": "9000/",
    "login": "9000/api/v1/auth/login",
    "chat": "5678/webhook/banking-chatbot"
  };

  const targetPath = urlMap[endpoint];
  if (!targetPath) return res.status(404).json({ error: "Invalid endpoint" });

  try {
    const axiosConfig = {
      method,
      url: `${BASE_URL}${targetPath}`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    };
    if (method === "get") axiosConfig.params = req.query;
    else axiosConfig.data = req.body;

    const response = await axios(axiosConfig);
    return res.status(response.status).json(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message || "Proxy error"
    });
  }
};

export default handler;
