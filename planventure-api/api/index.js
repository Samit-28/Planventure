export default function handler(req, res) {
  const accept = req.headers.accept || '';

  if (accept.includes('text/html')) {
    // Client prefers HTML → send HTML
    res.status(200).send('<h1>PlayVenture API is running 🚀</h1>');
  } else {
    // Default → send JSON
    res.status(200).json({ message: "PlayVenture API is running 🚀" });
  }
}
