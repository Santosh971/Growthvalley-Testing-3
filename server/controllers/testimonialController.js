const Testimonial = require('../models/Testimonial');
const { deleteFile } = require('../middleware/upload');

// @desc    Get all testimonials (public)
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
  try {
    const { status, featured } = req.query;

    let query = {};
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    const testimonials = await Testimonial.find(query)
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial'
    });
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/admin/all
// @access  Private (Admin)
exports.getAdminTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      Testimonial.find()
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Testimonial.countDocuments()
    ]);

    res.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
exports.createTestimonial = async (req, res) => {
  try {
    const {
      quote,
      author,
      designation,
      company,
      rating,
      featured,
      status
    } = req.body;

    // Auto Order
    const maxOrder = await Testimonial.findOne()
      .sort({ order: -1 })
      .select("order");

    const order = (maxOrder?.order || 0) + 1;

    // Handle avatar upload - Cloudinary returns URL in req.file.path
    let avatar = null;
    if (req.file) {
      // req.file.path contains the Cloudinary secure_url
      avatar = req.file.path;
    }

    // Create testimonial
    const testimonial = await Testimonial.create({
      quote,
      author,
      designation,
      company,
      avatar,
      rating: Number(rating) || 5,
      featured: featured === "true" || featured === true,
      status: status || "active",
      order,
    });

    return res.status(201).json({
      success: true,
      data: testimonial,
      message: "Testimonial created successfully",
    });

  } catch (error) {
    console.error("Create Testimonial Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial",
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    console.log("Update Testimonial : ", res)
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const {
      quote,
      author,
      designation,
      company,
      rating,
      featured,
      status,
      order,
    } = req.body;

    // Update fields safely
    if (quote !== undefined) testimonial.quote = quote;
    if (author !== undefined) testimonial.author = author;
    if (designation !== undefined) testimonial.designation = designation;
    if (company !== undefined) testimonial.company = company;

    if (rating !== undefined) {
      testimonial.rating = Number(rating);
    }

    if (featured !== undefined) {
      testimonial.featured =
        featured === true || featured === "true";
    }

    if (status !== undefined) {
      testimonial.status = status;
    }

    if (order !== undefined) {
      testimonial.order = Number(order);
    }

    // Handle avatar upload - Cloudinary returns URL in req.file.path
    if (req.file) {
      // Delete old avatar from Cloudinary if exists
      if (testimonial.avatar) {
        try {
          await deleteFile(testimonial.avatar);
        } catch (err) {
          console.log("Old avatar delete skipped");
        }
      }
      // Set new avatar URL from Cloudinary
      testimonial.avatar = req.file.path;
    }

    await testimonial.save();

    return res.status(200).json({
      success: true,
      data: testimonial,
      message: "Testimonial updated successfully",
    });

  } catch (error) {
    console.error("Update testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial",
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete avatar from Cloudinary if exists
    if (testimonial.avatar) {
      try {
        await deleteFile(testimonial.avatar);
      } catch (err) {
        console.log("Avatar delete skipped");
      }
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private (Admin)
exports.reorderTestimonials = async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, order }

    const updatePromises = orders.map(({ id, order }) =>
      Testimonial.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Testimonials reordered successfully'
    });
  } catch (error) {
    console.error('Reorder testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder testimonials'
    });
  }
};