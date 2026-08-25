import SystemLog from "../models/SystemLog.js"


export const addLog = async (req, res) => {
  try {
    const { action, user, userName, type } = req.body

    if (!action || !user) {
      return res.status(400).json({
        success: false,
        error: "Action and user are required"
      })
    }

    const log = new SystemLog({
      action,
      user,
      type
    })

    await log.save()

    res.status(201).json({
      success: true,
      message: "Log saved"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}


export const getLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      logs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};