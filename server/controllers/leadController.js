import Lead from '../models/Lead.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    let query;

    // Search and Filter
    const queryObj = { assignedTo: req.user._id };

    if (req.query.status && req.query.status !== '') {
      queryObj.status = req.query.status;
    }

    if (req.query.search && req.query.search !== '') {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    query = Lead.find(queryObj);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Lead.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit).sort('-createdAt');

    // Get stats for the current view (respecting search/filters)
    const statsQuery = Lead.aggregate([
      { $match: queryObj },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get global stats for the user (ignoring search/status filters)
    const globalStatsQuery = Lead.aggregate([
      { $match: { assignedTo: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const [stats, globalStats] = await Promise.all([statsQuery, globalStatsQuery]);

    const statsObj = {
      new: stats.find(s => s._id === 'new')?.count || 0,
      contacted: stats.find(s => s._id === 'contacted')?.count || 0,
      converted: stats.find(s => s._id === 'converted')?.count || 0,
    };

    const globalStatsObj = {
      new: globalStats.find(s => s._id === 'new')?.count || 0,
      contacted: globalStats.find(s => s._id === 'contacted')?.count || 0,
      converted: globalStats.find(s => s._id === 'converted')?.count || 0,
    };

    const leads = await query;

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      stats: statsObj,
      globalStats: globalStatsObj,
      data: leads,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
  try {
    req.body.assignedTo = req.user.id;

    const lead = await Lead.create(req.body);

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private
export const updateLeadStatus = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Make sure user owns the lead
    if (lead.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this lead' });
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Make sure user owns the lead
    if (lead.assignedTo.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
