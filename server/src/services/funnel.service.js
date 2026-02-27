import Event from '../models/Event.js'
import mongoose  from 'mongoose'

export const getFunnelServices  = async(projectId,steps,days)=>{

    const startDate = new Date()
    startDate.setDate(startDate.getDate()-days)

    const objectId = new mongoose.Types.ObjectId(projectId)

    const firstStepUsers = await Event.distinct('userId', {
        projectId: objectId,
        name: steps[0],
        userId: { $ne: null },
        timestamp: { $gte: startDate },
    });

    const funnelResult = [
        { step: steps[0], count: firstStepUsers.length },
    ];

    let remainingUser = firstStepUsers

    for (let i=1;i<steps.length;i++){
        if(remainingUser.length===0){
            funnelResult.push({step:steps[i],count:0})
            continue
        }

        const usersWhoDidThisStep = await Event.distinct('userId', {
            projectId: objectId,
            name: steps[i],
            userId: { $in: remainingUser},
            timestamp: { $gte: startDate },
        });

        funnelResult.push({
            step:steps[i],
            count:usersWhoDidThisStep.length
        })

        remainingUser= usersWhoDidThisStep;

    }
    
    return funnelResult;

}