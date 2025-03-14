import { Router } from 'express'
import { asyncHandler } from '../../Helpers/asynchandler.js'
import { authentication, checkPermission } from '../../Auth/checkAuth.js'
import AccountController from '../../controller/account.controller.js'

const accountRouter = Router()

// Public routes
// Protected routes
accountRouter.use('/', asyncHandler(authentication))

accountRouter.get('/get-account-by-id', asyncHandler(AccountController.getAccountById))
// Account management
// accountRouter.get('/profile', asyncHandler(AccountController.getProfile))
// accountRouter.put('/profile', asyncHandler(AccountController.updateProfile))
// accountRouter.delete('/', asyncHandler(AccountController.deleteAccount))

// Account settings
// accountRouter.put('/change-password', asyncHandler(AccountController.changePassword))
// accountRouter.put('/settings', asyncHandler(AccountController.updateSettings))


//account management

accountRouter.use('/admin', checkPermission('C'))
accountRouter.get('/admin/get-all-account', asyncHandler(AccountController.getAllAccount))
accountRouter.delete('/admin/delete-account', asyncHandler(AccountController.deleteAccount))
accountRouter.patch('/admin/update-role', asyncHandler(AccountController.updateRole))
accountRouter.get('/admin/get-user-activity-log', asyncHandler(AccountController.getUserActivityLog))
export default accountRouter