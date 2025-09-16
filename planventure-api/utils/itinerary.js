// utils/itinerary.js

/**
 * Generates a simple default itinerary for a trip.
 * @param {string | Date} startDate
 * @param {string | Date} endDate
 * @returns {object} itinerary
 */
export function generateDefaultItinerary(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const itinerary = { days: [] };
    let currentDate = new Date(start);

    while (currentDate <= end) {
        const dayName = currentDate.toDateString(); // e.g., "Wed Oct 01 2025"
        itinerary.days.push({
            date: currentDate.toISOString().split('T')[0],
            activities: [`Default activity for ${dayName}`]
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return itinerary;
}