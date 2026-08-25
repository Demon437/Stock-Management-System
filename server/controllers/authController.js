import User from '../models/Users.js'
import bcrypt from 'bcrypt'

const login = async (req, res) => {

  try {

    const email = req.body.email.trim().toLowerCase()
    const password = req.body.password

    const user = await User.findOne({ email })

    if (!user) {

      return res.status(404).json({
        success: false,
        error: 'User Not Found'
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        error: 'Wrong Password'
      })
    }

    return res.status(200).json({

      success: true,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    })

  } catch (error) {

    console.log("LOGIN ERROR:", error)

    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

export { login }