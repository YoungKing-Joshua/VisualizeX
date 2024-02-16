//A d3 code

d3.select();
d3.selectAll();

d3.select('h1').style('color', 'blue')
.attr('class', 'heading')
.text('Updated tag')

d3.select('body').append('p').text('First Paragraph');
d3.select('body').append('p').text('Second Paragraph');
d3.select('body').append('p').text('Third Paragraph');
d3.select('body').append('p').text('Fourth Paragraph');

d3.selectAll('p').style('color', 'red');
