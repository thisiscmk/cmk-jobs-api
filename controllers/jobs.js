//Jobs Controller

const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors")

//Get the jobs associated with this user
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt")
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

//Get the specific job associated with the Job ID
const getJob = async (req, res) => {
  const user = req.user.userId
  const jobId = req.params.id

  const job = await Job.findOne({
    _id: jobId,
    createdBy: user
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  //access the user id to know who created the job
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const user = req.user.userId
  const jobId = req.params.id

  const {
    body: { company, position }
  } = req

  //send bad request error if company or position is empty in the request body
  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields can not be empty")
  }

  const job = await Job.findByIdAndUpdate({ _id: jobId, createdBy: user }, req.body, { new: true, runValidators: true })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const user = req.user.userId
  const jobId = req.params.id

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: user
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job })
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
