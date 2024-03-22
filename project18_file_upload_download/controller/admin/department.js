const moment = require('moment');
const Departments = require('../../model/departments');
const Designations = require('../../model/designation');
const { verifyCsrfToken } = require('../../utils/csrf');
const AppError = require('../../utils/error');

// Department Contollers
exports.getAllDepartments = (req, res, next) => {
	const user = req.user || req.locals.user;
	Departments.find()
		.then((result) => {
			res.status(200).render('manage_department', {
				title: 'Department',
				user,
				moment,
				departments: result,
			});
		})
		.catch((error) => {
			next(new AppError(error, 500));
		});
};

exports.updateDepartment = (req, res, next) => {
	const id = req.params.id;
	const { departmentName, departmentAbbr, _csrf } = req.body;
	const lastUpdated = Date.now();

	const csrfVerified = verifyCsrfToken(_csrf);
	if (!csrfVerified) {
		req.toastr.error('CSRF Validation Failed');
		return res.redirect('/');
	}

	Departments.findByIdAndUpdate(id, {
		departmentName: departmentName,
		departmentAbbr: departmentAbbr,
		updatedAt: lastUpdated,
	})
		.then((result) => {
			req.toastr.success('Department Updated!');
			return res.status(201).redirect('/department');
		})
		.catch((error) => {
			next(new AppError(error, 500));
		});
};

exports.deleteDepartment = (req, res, next) => {
	const id = req.params.id;
	Departments.findByIdAndDelete(id)
		.then((result) => {
			req.toastr.success('Department Deleted!');
			return res.redirect('/department');
		})
		.catch((error) => {
			next(new AppError(error, 500));
		});
};

exports.getAddDepartments = (req, res, next) => {
	const user = req.user || req.locals.user;
	Designations.find()
		.then((result) => {
			res.render('add_department', {
				title: 'Add Department',
				user,
				designations: result,
			});
		})
		.catch((error) => {
			next(new AppError(error, 500));
		});
};

exports.postAddDepartments = (req, res, next) => {
	const { designation, departmentAbbr, departmentName, _csrf } = req.body;

	const csrfVerified = verifyCsrfToken(_csrf);
	if (!csrfVerified) {
		req.toastr.error('CSRF Validation Failed');
		return res.redirect('/');
	}

	Departments.findOne({ departmentName })
		.then((result) => {
			if (result) {
				req.toastr.error(`${departmentName} is Already Registered`);
				return res.redirect('/department/add');
			}

			const department = new Departments({
				designations: designation,
				departmentName: departmentName,
				departmentAbbr: departmentAbbr,
			});
			department
				.save()
				.then((reslt) => {
					req.toastr.success('Department Added Successfully!');
					return res.redirect('/department');
				})
				.catch((error) => {
					next(new AppError(error, 500));
				});
		})
		.catch((error) => {
			next(new AppError(error, 500));
		});
};
