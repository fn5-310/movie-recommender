import Example from "../models/example.model.js";

export const getAll = async (_req, res) => {
  try {
    const items = await Example.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Example.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    // Only allow these specific fields to be set — adjust if the schema changes
    const { name, description } = req.body;
    const item = await Example.create({ name, description });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    // Same allowlist as create — never pass req.body straight through
    const { name, description } = req.body;
    const item = await Example.findByIdAndUpdate(
      req.params.id,
      { name, description },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Example.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
