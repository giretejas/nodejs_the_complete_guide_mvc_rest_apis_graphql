const moment = require('moment');
const Designation = require('../../model/designation');

exports.getAllDesignations = (req, res, next) => {
	const user = req.user || req.locals.user;
	Designation.find()
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
	res.render('add_designation', {
		title: 'Add Designations',
		user,
	});
};

exports.postAddDesignation = (req, res, next) => {
	const { designation, description } = req.body;
	Designation.findOne({ designation })
		.then((result) => {
			if (result) {
				console.log(`${designation} is Already Registered`);
				return res.redirect('/department/add');
			}

			const design = new Designation({
				designation: designation,
				description: description,
			});
			design
				.save()
				.then((reslt) => {
					console.log('Department Added Successfully!');
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
	const { designation, description } = req.body;

	Designation.findByIdAndUpdate(id, {
		designation: designation,
		description: description,
	})
		.then((result) => {
			console.log('Designation Updated!');
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
			console.log('Designation Deleted!');
			return res.redirect('/designation');
		})
		.catch((error) => {
			console.log(error);
		});
};