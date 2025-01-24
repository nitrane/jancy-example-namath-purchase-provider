# Jancy Example Namath Provider

## Structure of the Plug-in
- `example-namath-purchase-provider/package.json` - A simple file that describes the plugin to Jancy and specifies an entry point. `src/index.js` in this example.
- `example-namath-purchase-provider/src/index.js` - This is the main file that implements most of our plugins logic. The most important part is the object exported that has a couple of very specific jancy properties and functions (jancy_props, jancy_onInit, jancy_onEnabled, jancy_onDisabled). That's probably where you should start

## Adding the Plug-in to Jancy

1. Open the Jancy plug-in folder
    - On Windows, open Windows File Explorer and go to %appdata%\Jancy\plugins or on MacOS
    - On MacOS, open Finder and go to `~/Library/Application Support/Jancy/plugins`
2. Copy `example-namath-purchase-provider` folder to the plug-ins folder from step 1.
3. Restart Jancy if it's already running.
4. If everything works correctly you should see the example plugin in the list of plugins in `File -> Settings -> Plugins`.
5. Go to the Namath settings panel (`File -> Setting -> Namath`)
6. Click the + button and select the "Create a Namath Instance that sends Purchases to ExampleNamathPurchaseProvider" option
7. In the dialog that appears type in a Key and a Name. You will have to edit the dialog code to have the fields you want for your setup.
8. Press the "Add" button.
9. If all works correctly, you should see an entry for the provider instance you just created. You can press the test button to see if it works
10. You can go to TicketMaster and use Namath as you would normally and send to your provider

# Data Structures

## Cart

The cart is an object the you will be using to get the data for your service
### Properties

#### uuid
The unique identifier for the purchase.
#### cartUpdated
The timestamp of the last time the cart was updated.
#### cartCreatedTime
The timestamp of the time the cart was created.
#### cartExpirationTime
The time when the cart will expire. It is calculated based on the page we are on.
#### fieldColors
An object that maps field names to colors. Mostly used internally, but you can use it.
#### tab
The tab ID that the purchase is associated with.
#### row
The row number of the seats in the purchase.
#### section
The section number of the seats in the purchase.
#### seats
A comma-separated list of the seat numbers in the purchase.
#### event
The name of the event in the purchase.
#### venue
The name of the venue where the event is taking place.
#### quantity
The number of seats for all tickets in the purchase.
#### currency
The currency of the purchase (USD, CAN, etc).
#### total
The total price of the purchase, includes fees and taxes.
#### fees
The total amount of fees associated with the tickets in the purchase.
#### tax
The total amount of tax associated with the tickets in the purchase.
#### costPerTicket
The cost of each seat in the purchase, excluding fees and tax.
#### dateTime
The date and time of the event in the purchase.
#### oddEven
Whether or not the row number of the seats in the purchase is odd or even.
#### deliveryMethod
The delivery method for the tickets in the purchase.
#### isInsured
Whether or not the tickets in the purchase are insured.
#### marketplace
The marketplace where the tickets in the purchase were purchased.
#### feeAndCostPerTicket
The total cost of each seat in the purchase, including fees and taxes.
#### ticketType
The type of ticket in the purchase.
#### feesPerTicket
The amount of fees associated with each seat in the purchase.
#### orderNumber
The order number that is for the purchase