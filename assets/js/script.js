// Initialize place to store string data
var tasks = [];

// setup timeblocks for editing as necessary.
var timeblocks = [];

// setup savebtns to add event listeners.
var savebtns = [];

// Add timeblocks and savebuttons to arrays
for(var i = 9; i <= 17; i++)
{
    // Query for savebuttons
    var savebtn = $("#timeblock-" + i + " .saveBtn");

    // Query for timeblock using id
    var block = $("#timeblock-" + i + " textarea");
    
    // Setup the timeblock
    var time = moment().startOf('day').add(i, 'hours');

    // Setup an object for easy reference
    var timeblock = 
    {
        block: block,
        time: time
    }

    // Add element to timeblocks
    timeblocks.push(timeblock);

    // Add save buttons to array
    savebtns.push(savebtn);
}

// Initial load of page
loadPage();

// Add event listeners to save buttons.
savebtns.forEach(function(button, index)
{
    var value = button.parent().attr("id").replace("timeblock-", "");
    button.click(function()
    {
        text = $("#timeblock-" + value + " textarea").val();
        tasks[value - 9] = text;
        localStorage.setItem("tasks",JSON.stringify(tasks));
    });
});

// update background of page every 5 minutes to match real time.
function updateBackground()
{
    for(var i = 0; i < timeblocks.length; i++)
    {
        // Remove any classes that add backgound formatting
        timeblocks[i].block.removeClass("past");
        timeblocks[i].block.removeClass("present");
        timeblocks[i].block.removeClass("future");

        // Setup time equal to beginning of hour
        var startHour = moment().startOf('hour');

        // Add class to style backgrounds.
        if(startHour.diff(timeblocks[i].time, 'hour') === 0)
        {
            timeblocks[i].block.addClass("present");
        }
        else if(startHour.diff(timeblocks[i].time, 'hour') < 0)
        {
            timeblocks[i].block.addClass("future");
        }
        else if(startHour.diff(timeblocks[i].time, 'hour') > 0)
        {
            timeblocks[i].block.addClass("past");
        }
    }
}

// Function to load tasks and setup page.
function loadPage()
{
    // Load data or setup data, if not setup
    var localData = localStorage.getItem("tasks");
    if(!localData)
    {
        for(var i = 0; i < timeblocks.length; i++)
        {
            tasks.push("");
        }
        return false;
    }
    tasks = JSON.parse(localData);

    // Use local data to change page.
    timeblocks.forEach(function(block, index)
    {
        block.block.val(tasks[index]);
    })
}

// Initial event to update background colors.
updateBackground();

// Add a timed event to update the look of the look of the buttons
setInterval(updateBackground, 6000000)