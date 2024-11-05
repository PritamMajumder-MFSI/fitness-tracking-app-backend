import cron from "node-cron";
import { Goal, Notification } from "../models";

cron.schedule("30 2 * * *", async () => {
  console.log("Running cron to send notification of completed goals");

  const goals = await Goal.aggregate([
    {
      $match: {
        isActive: true,
        isNotified: false,
      },
    },
    {
      $lookup: {
        from: "workouts",
        let: { fromDate: "$from", toDate: "$to", userId: "$userId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$userId"] },
                  { $gte: ["$date", "$$fromDate"] },
                  { $lte: ["$date", "$$toDate"] },
                ],
              },
            },
          },
        ],
        as: "workouts",
      },
    },
    {
      $addFields: {
        totalCalories: {
          $sum: "$workouts.calories",
        },
        totalWorkouts: {
          $size: "$workouts",
        },
      },
    },
    {
      $addFields: {
        progress: {
          $cond: {
            if: { $eq: ["$goalType", "specificCalorieGoal"] },
            then: {
              $multiply: [{ $divide: ["$totalCalories", "$targetValue"] }, 100],
            },
            else: {
              $multiply: [{ $divide: ["$totalWorkouts", "$targetValue"] }, 100],
            },
          },
        },
      },
    },
    {
      $match: {
        progress: { $gte: 100 },
      },
    },
    {
      $project: {
        _id: 1,
        goalType: 1,
        targetValue: 1,
        totalWorkouts: 1,
        totalCalories: 1,
        progress: 1,
        userId: 1,
      },
    },
  ]);

  const goalIds = goals.map((goal) => goal._id);
  const notificationsToCreate = goals.map((goal) => ({
    userId: goal.userId,
    message: `Congratulations! You've completed your goal for ${goal.goalType}.`,
    goalId: goal._id,
  }));
  await Goal.updateMany(
    { _id: { $in: goalIds } },
    { $set: { isNotified: true } }
  );
  await Notification.insertMany(notificationsToCreate);
});
