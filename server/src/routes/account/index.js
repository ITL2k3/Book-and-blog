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

//dashboard
accountRouter.get('/admin/get-total-user', asyncHandler(AccountController.getTotalUser))
accountRouter.get('/admin/get-new-user-by-month', asyncHandler(AccountController.getNewUserByMonth))
accountRouter.get('/admin/get-total-action-of-user', asyncHandler(AccountController.getTotalActionOfUser))
accountRouter.get('/admin/get-top-popular-actions', asyncHandler(AccountController.getTopPopularActions))
accountRouter.get('/admin/get-top-notified-users', asyncHandler(AccountController.getTopNotifiedUsers))

//account management

accountRouter.use('/admin', checkPermission('C'))
accountRouter.get('/admin/get-all-account', asyncHandler(AccountController.getAllAccount))
accountRouter.delete('/admin/delete-account', asyncHandler(AccountController.deleteAccount))
accountRouter.patch('/admin/update-role', asyncHandler(AccountController.updateRole))
accountRouter.get('/admin/get-user-activity-log', asyncHandler(AccountController.getUserActivityLog))




export default accountRouter