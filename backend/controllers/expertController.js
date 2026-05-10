import Expert from '../models/Expert.js';

export async function getExperts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    const filter = {};
    if (search && String(search).trim()) {
      filter.name = { $regex: String(search).trim(), $options: 'i' };
    }
    if (category && String(category).trim()) {
      filter.category = String(category).trim();
    }

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter).skip(skip).limit(limit).lean();

    const pages = total === 0 ? 1 : Math.ceil(total / limit);

    res.json({ experts, total, page, pages });
  } catch (err) {
    next(err);
  }
}

export async function getExpertById(req, res, next) {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }
    res.json(expert);
  } catch (err) {
    next(err);
  }
}
