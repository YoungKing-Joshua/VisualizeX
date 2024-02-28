const hide = (element) =>
{
    element.setAttribute('hidden', '');
};

const show = (element) =>
{
    element.removeAttribute('hidden');
};

const plotData = (data, type, title = '') =>
{
    var layout = {
        width: window.innerWidth,
        height: window.innerHeight,
        title,
    };
    if (type === 'scatter')
    {
        Plotly.newPlot('graphHolder', data, layout);
    } else if (type === 'bar')
    {
        Plotly.newPlot('graphHolder', data, { ...layout, barmode: 'group' });
    } else if (type === 'line')
    {
        Plotly.newPlot('graphHolder', data, { ...layout, mode: 'lines+markers' });
    } else if (type === 'pie')
    {
        Plotly.newPlot('graphHolder', data, { ...layout, type: 'pie' });
    }
};

const processData = (rows, type) =>
{
    const x = [], text = [];
    const xVariableElement = [...document.querySelectorAll('input[name="xAxisChoice"]')].find((el) => el.checked);
    const xVariable = xVariableElement?.dataset?.header;
    if (xVariable === undefined)
    {
        alert('You have to select an x-axis for this to work');
        throw new Error('No x-axis selected for graphing');
    }
    const sortedRows = rows.sort((a, b) => a[xVariable] - b[xVariable]);

    const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
    const allYs = {};
    let userChoseAYValue = false;
    checkboxes.forEach((checkbox) =>
    {
        const { checked, name } = checkbox;
        if (checked)
        {
            allYs[name] = [];
            userChoseAYValue = true;
        }
    });

    if (!userChoseAYValue)
    {
        alert('You have to select values for the y-axis for this to work');
        throw new Error('No y-axis selected for graphing');
    }

    document.getElementById('interface').innerHTML = "";

    sortedRows.forEach((row) =>
    {
        x.push(row[xVariable]);
        Object.keys(allYs).forEach((header) =>
        {
            allYs[header].push(row[header]);
        });
        if (Object.prototype.hasOwnProperty.call(row, 'day_time'))
        {
            const date = new Date(parseFloat(row.day_time));
            text.push(date.toLocaleString());
        } else
        {
            text.push('');
        }
    });

    const traces = Object.keys(allYs).map((yLabel) =>
    {
        if (type === 'pie')
        {
            return {
                values: allYs[yLabel],
                labels: x,
                type: 'pie',
                textinfo: 'label+percent',
                name: yLabel,
            };
        } else
        {
            return {
                x,
                y: allYs[yLabel],
                text,
                type: type === 'scatter' ? 'scatter' : type === 'bar' ? 'bar' : 'line',
                mode: type === 'scatter' ? 'markers' : 'lines+markers',
                name: yLabel,
            };
        }
    });

    return traces;
};

const makePlot = (input, type) =>
{
    // document.querySelector('body').style = "margin: 0; padding: 0; overflow: hidden;";
    hide(document.getElementById('interface'));
    show(document.getElementById('graphHolder'));

    d3.csv(input, (rows) =>
    {
        const traces = processData(rows, type);
        plotData(traces, type);
    });
};

window.onload = () =>
{
    show(document.getElementById('interface'));
    const docPicker = document.getElementById('docPicker');
    const scatterButton = document.getElementById('startGraphing');
    const barChartButton = document.getElementById('plotBarChart');
    const lineChartButton = document.getElementById('plotLineChart');
    const pieChartButton = document.getElementById('plotPieChart');

    const handleClick = (type) =>
    {
        const fileList = docPicker.files;
        const file = fileList[fileList.length - 1];
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (event) =>
        {
            makePlot(event.target.result, type);
        });
        fileReader.readAsDataURL(file);
    };

    scatterButton.addEventListener('click', () => handleClick('scatter'));
    barChartButton.addEventListener('click', () => handleClick('bar'));
    lineChartButton.addEventListener('click', () => handleClick('line'));
    pieChartButton.addEventListener('click', () => handleClick('pie'));

    docPicker.addEventListener('change', (event) =>
    {
        show(document.getElementById('selectionInterface'));
        show(document.getElementById('startGraphing'));
        show(document.getElementById('plotBarChart'));
        show(document.getElementById('plotLineChart'));
        show(document.getElementById('plotPieChart'));

        const fileList = event.target.files;
        const file = fileList[fileList.length - 1];

        const fileReader = new FileReader();
        fileReader.addEventListener('load', (event) =>
        {
            d3.csv(event.target.result, (data) =>
            {
                if (data.length)
                {
                    const headers = Object.keys(data[0]);
                    const headersHTML = headers.map((header) =>
                    {
                        return `<label for="${header}-header">
                        <input type="checkbox" id="${header}-header" name="${header}"> ${header}
                        </label>`;
                    });
                    const xAxisVariableHTML = headers.map((header) =>
                    {
                        return `<label for="${header}-axis">
                        <input type="radio" id="${header}-axis" data-header="${header}" name="xAxisChoice"> ${header}
                        </label>`;
                    });

                    const graphHeaders = document.getElementById('graphHeaders');
                    const xAxisVariable = document.getElementById('xAxisVariable');
                    graphHeaders.innerHTML = headersHTML.join('<br/>');
                    xAxisVariable.innerHTML = xAxisVariableHTML.join('<br/>');
                }
            });
        });

        fileReader.readAsDataURL(file);
    });
};
