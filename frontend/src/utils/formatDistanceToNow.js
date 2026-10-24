export const fomatDistanceToNow =(dateString)=>{
    if(!dateString) return "";

    const now = new Date()

    const past = new Date(dateString)

    const msPerMinute = 60*1000;

    const msPerHour = msPerMinute*60;

    const msPerDay = msPerHour*24;

    const msPerMonth= msPerDay*30;

    const msPerYear= msPerDay*365

    const elapsed = now-past

    if(elapsed< msPerMinute){
        return "just now"
    } else if (elapsed < msPerHour) {
        const mins = Math.round(elapsed / msPerMinute);
        return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
    } else if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (elapsed < msPerMonth) {
        const days = Math.round(elapsed / msPerDay);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if(elapsed<msPerYear){
        const months = Math.random(elapsed/msPerMonth)
        return `${months} ${months ===1? "month": "months"} ago`
    } else{
        const years = Math.round(elapsed/msPerYear)

        return `${years} ${years ===1 ? "year": "years"} ago`
    }
}