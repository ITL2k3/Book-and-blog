import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication } from '../../Auth/checkAuth.js'
import AccountController from '../../controller/account.controller.js'

const accountRouter = Router()

// Public routes

// Protected routes
// accountRouter.use('/', asyncHandler(authentication))

// Account management
// accountRouter.get('/profile', asyncHandler(AccountController.getProfile))
// accountRouter.put('/profile', asyncHandler(AccountController.updateProfile))
// accountRouter.delete('/', asyncHandler(AccountController.deleteAccount))

// Account settings
// accountRouter.put('/change-password', asyncHandler(AccountController.changePassword))
// accountRouter.put('/settings', asyncHandler(AccountController.updateSettings))

export default accountRouter