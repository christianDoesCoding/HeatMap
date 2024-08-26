require('dotenv').config();

const { AUTH_TOKEN, USERNAME } = process.env;

document.addEventListener("DOMContentLoaded", () => {
    let data = new Date(new Date().getFullYear(), 0, 1);
    for (let i = 0; i < 8000; i++) {
        let daysToIncrease = Math.floor(Math.random() * 500);
        newDate = new Date(data);
        newDate.setDate(newDate.getDate() + i);
        $heat.addDate("heat-map-1", newDate, null, false);
    }
    $heat.refreshAll()
});


async function fetchClientData() {
    const query = `
        {
            user(login: "${USERNAME}") {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch("API link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        data.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
            (week) =>
                week.contributionDays.forEach((day) => {
                    const contributionDate = new Date(day.date);
                    const contributionCount = day.contributionCount;
                    $heat.updateDate("heat-map-1", contributionDate, contributionCount);
                })
        );
    } catch (error) {
        console.error("Error fetching contribution data:", error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await fetchClientData();
    $heat.refreshAll();
});

function bindingOptions() {
    return {
      colorRanges: [
        {
          minimum: 1,
          cssClassName: "day-color-1",
          mapCssClassName: "day-color-1",
          chartCssClassName: "chart-color-1",
          statisticsCssClassName: "statistics-color-1",
          tooltipText: "Day Color 1",
          visible: true,
        },
        {
          minimum: 3,
          cssClassName: "day-color-2",
          mapCssClassName: "day-color-2",
          chartCssClassName: "chart-color-2",
          statisticsCssClassName: "statistics-color-2",
          tooltipText: "Day Color 2",
          visible: true,
        },
        {
          minimum: 5,
          cssClassName: "day-color-3",
          mapCssClassName: "day-color-3",
          chartCssClassName: "chart-color-3",
          statisticsCssClassName: "statistics-color-3",
          tooltipText: "Day Color 3",
          visible: true,
        },
        {
          minimum: 8,
          cssClassName: "day-color-4",
          mapCssClassName: "day-color-4",
          chartCssClassName: "chart-color-4",
          statisticsCssClassName: "statistics-color-4",
          tooltipText: "Day Color 4",
          visible: true,
        },
      ],
      descriptionText: "A basic demo of heatmaps with Heat.js",
    };
  }