const TeamMember = require('../models/TeamMember');
const { deleteFile } = require('../middleware/upload');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      // Public route only shows active members
      query.status = 'active';
    }
    // If status === 'all', don't filter by status (show all)

    const members = await TeamMember.find(query).sort({ order: 1, createdAt: 1 });
    console.log("Team Members : ", members);
    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
    });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    console.log("Team Members : ", member);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member',
    });
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private (Admin)

exports.createTeamMember = async (req, res) => {
  try {
    console.log("Member Response : ", req);
    const data = { ...req.body };

    // Handle Image Upload - Cloudinary returns URL in req.file.path
    if (req.file) {
      // req.file.path contains the Cloudinary secure_url
      data.image = req.file.path;
    }

    const member = await TeamMember.create(data);
    console.log("Team Members : ", member);
    res.status(201).json({
      success: true,
      data: member,
      message: 'Team member created successfully',
    });

  } catch (error) {
    console.error('Create team member error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);

      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create team member',
    });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private (Admin)
exports.updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    console.log("Team Members : ", member);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    // Handle image upload if new file is provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (member.image) {
        try {
          await deleteFile(member.image);
        } catch (err) {
          console.log("Old image delete skipped");
        }
      }
      // Set new image URL from Cloudinary
      req.body.image = req.file.path;
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      member[key] = req.body[key];
    });

    await member.save();

    res.json({
      success: true,
      data: member,
      message: 'Team member updated successfully',
    });
  } catch (error) {
    console.error('Update team member error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update team member',
    });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private (Admin)
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    console.log("Team Members : ", member);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found',
      });
    }

    // Delete image from Cloudinary if exists
    if (member.image) {
      try {
        await deleteFile(member.image);
      } catch (err) {
        console.log("Image delete skipped");
      }
    }

    await member.deleteOne();

    res.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member',
    });
  }
};

// @desc    Reorder team members
// @route   PUT /api/team/reorder
// @access  Private (Admin)
exports.reorderTeamMembers = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    // console.log("Team Members : ", members);
    for (const item of orders) {
      await TeamMember.findByIdAndUpdate(item.id, { order: item.order });
    }

    res.json({
      success: true,
      message: 'Team members reordered successfully',
    });
  } catch (error) {
    console.error('Reorder team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder team members',
    });
  }
};