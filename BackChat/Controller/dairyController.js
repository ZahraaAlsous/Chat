import Dairy from "../Models/dairyModel.js";

export const addDairy = async (req, res) => {
  try {
    const userId = req.user._id;
    const { text } = req.body;
    let dairy = await Dairy.create({
      text,
      userId,
    });

    res.status(201).json({ dairy });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

export const allDairy = async (req, res) => {
  try {
    const userId = req.user._id;
    const dairys = await Dairy.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(dairys);
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

export const deleteDairy = async (req, res) => {
  try {
    const dairyId = req.params.dairyId
    const dairy = await Dairy.findByIdAndDelete(dairyId);
    res.status(201).json("the dairy delete");
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};
