const moment = require('moment');
const Designation = require('../../model/designation');
const Departments = require('../../model/departments');
const { verifyCsrfToken } = require('../../utils/csrf');

exports.getAllDesignations = (req, res, next) => {
	const user = req.user || req.locals.user;
	Designation.find()
		.populate('departmentId')
		.then((result) => {
			res.render('manage_designation', {
				title: 'Designations',
				user,
				moment,
				designations: result,
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.getAddDesignation = (req, res, next) => {
	const user = req.user || req.locals.user;
	Departments.find()
		.then((result) => {
			res.render('add_designation', {
				title: 'Add Designations',
				user,
				departments: result,
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.postAddDesignation = (req, res, next) => {
	const { department, designation, description, _csrf } = req.body;

	const csrfVerified = verifyCsrfToken(_csrf);
	if (!csrfVerified) {
		req.toastr.error('CSRF Validation Failed');
		return res.redirect('/');
	}

	Designation.findOne({ designation })
		.then((result) => {
			if (result) {
				req.toastr.error(`${designation} is Already Registered`);
				return res.redirect('/department/add');
			}

			const design = new Designation({
				departmentId: department,
				designation: designation,
				description: description,
			});
			design
				.save()
				.then((reslt) => {
					req.toastr.success('Department Added Successfully!');
					return res.redirect('/designation');
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.updateDesignation = (req, res, next) => {
	const id = req.params.id;
	const { designation, description, _csrf } = req.body;

	const csrfVerified = verifyCsrfToken(_csrf);
	if (!csrfVerified) {
		req.toastr.error('CSRF Validation Failed');
		return res.redirect('/');
	}

	Designation.findByIdAndUpdate(id, {
		designation: designation,
		description: description,
	})
		.then((result) => {
			req.toastr.success('Designation Updated!');
			return res.redirect('/designation');
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.deleteDesignation = (req, res, next) => {
	const id = req.params.id;
	Designation.findByIdAndDelete(id)
		.then((result) => {
			req.toastr.success('Designation Deleted!');
			return res.redirect('/designation');
		})
		.catch((error) => {
			console.log(error);
		});
};
