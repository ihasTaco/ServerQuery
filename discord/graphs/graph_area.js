function hexToRgba(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function graph_area(graphSettings, players, trend_line, labels) {
    //console.log(`\n-- Configuring Area Graph --`)
    //console.log(`Graph Settings: `, graphSettings)
    //console.log(`Players: `, players)
    //console.log(`Trend Line: `, trend_line)
    //console.log(`Labels: `, labels)

    let playersDataForBar = [];
    
    let maxPlayerValue;

    if (Math.max(...players) == 0) {
        maxPlayerValue = 2;
    } else {
        maxPlayerValue = 2 * Math.max(...players);
    }

    for (let i = 0; i < players.length; i++) {
        if (players[i] === -1) {
            playersDataForBar[i] = maxPlayerValue;
            players[i] = 0;
        } else {
            playersDataForBar[i] = null;
        }
    }

    for(let i = 0; i < trend_line.length; i++) {
        if(trend_line[i] < 0) {
            trend_line[i] = 0;
        }
    }

    const configuration = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Server Offline',
                    type: 'bar',
                    data: playersDataForBar,
                    backgroundColor: 'red'
                },
                {
                    label: 'Players',
                    data: players,
                    borderColor: hexToRgba(graphSettings.graph_line_settings.player_settings.line_color, 1),
                    fill: !graphSettings.graph_line_settings.player_settings.disable,
                    backgroundColor: hexToRgba(graphSettings.graph_line_settings.player_settings.fill_color, graphSettings.graph_line_settings.player_settings.fill_opacity),
                    pointRadius: 0,
                    borderWidth: 1
                }, 
                {
                    label: 'Trends',
                    data: trend_line,
                    borderColor: hexToRgba(graphSettings.graph_line_settings.trend_settings.color, 1),
                    borderDash: [5, 5],
                    fill: !graphSettings.graph_line_settings.trend_settings.disable,
                    pointRadius: 0,
                    borderWidth: 1
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: !graphSettings.legend_settings.disable,
                    labels: {
                        color: hexToRgba(graphSettings.legend_settings.background_color, 1),
                        borderColor: hexToRgba(graphSettings.legend_settings.border_color, 1),
                    }
                },
                title: {
                    display: !graphSettings.title_settings.disable,
                    text: graphSettings.title_settings.text,
                    color: hexToRgba(graphSettings.title_settings.color, 1),
                }
            },
            scales: {
                x: {
                    display: true,
                    time: {
                        unit: 'hour'
                    },
                    title: {
                        display: true,
                        text: graphSettings.y_label_settings.text,
                        color: hexToRgba(graphSettings.x_label_settings.color, 1),
                    },
                    ticks: {
                        major: true,
                        autoSkip: false,
                        min: 10,
                        max: 24,
                        grace: '5%',
                        color: hexToRgba(graphSettings.tick_settings.x_color, 1),
                        afterBuildTicks: function(scale, ticks) {
                            var majorTicks = ticks.filter((tick) => {
                                return tick.major;
                            });
                            return majorTicks;
                        }
                    },
                    grid: {
                        display: false,
                        color: hexToRgba(graphSettings.graph_line_settings.grid_settings.color, graphSettings.graph_line_settings.grid_settings.opacity),
                    }
                },
                y: {
                    min: 0,
                    max: maxPlayerValue,
                    display: true,
                    title: {
                        display: true,
                        text: graphSettings.x_label_settings.text,
                        color: hexToRgba(graphSettings.y_label_settings.color, 1),
                    },
                    ticks: {
                        color: hexToRgba(graphSettings.tick_settings.y_color, 1),
                    },
                    grid: {
                        color: hexToRgba(graphSettings.graph_line_settings.grid_settings.color, graphSettings.graph_line_settings.grid_settings.opacity),
                    }
                }
            }
        }
    };
    return configuration;
}

module.exports = graph_area;