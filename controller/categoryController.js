import Categorymodel from "../models/Categorymodel.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const slug = slugify(name);
    const existingCategory = await Categorymodel.findOne({ slug });

    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await new Categorymodel({ name, slug }).save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error during category creation",
      error: error.message, // Include error message for debugging
    });
  }
};
export const updateCategory = async (req, res) => {
    try {
      const { name } = req.body;
      const { slug } = req.params;
      
      if (!name) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
        });
      }
  
      const updatedCategory = await Categorymodel.findOneAndUpdate(
        { slug },
        { name, slug: slugify(name) },
        { new: true }
      );
  
      res.status(200).send({
        success: true,
        message: "Category updated successfully",
        updatedCategory,
      });
    }   catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Error during category update",
        error: error.message, // Include error message for debugging
      });
    }
};
export const categoryController = async (req, res) => {
    try {
        const categories = await Categorymodel.find({});
        res.status(200).send({
            success: true,
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during fetching categories",
            error: error.message,
        });
    }
}
export const singlecategoryController = async (req, res) => {
    try {
        console.log("Requested Slug:", req.params.slug); // Debugging line
        
        const category = await Categorymodel.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).send({
            success: true,
            category,
        });  
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error during fetching single category",
            error: error.message,
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Categorymodel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
            deletedCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error during category deletion",
            error: error.message,
        });
    }
}

