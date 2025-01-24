const {EventEmitter} = require('events')
let myMessageAPI = null

const ExampleNamathPurchaseProviderFactory = {
  id: 'cf88699f-c9a7-426e-9fbb-74699b5d94c1', //generate a uuid that you want
  description: 'Create a Namath Instance that sends Purchases to ExampleNamathPurchaseProvider', //this text shows up in Namath when users click the '+' button to add a provider
  showFactoriesToUser: true,
  persistProviders: true,
  createProvider(jancy, state={}) {
    return new ExampleNamathPurchaseProvider(jancy, state)
  },
  addProvider(jancy, browserWindow) {
    providerDialog(jancy, browserWindow)
  }  
}

/**
 ** Cart object is an object that is sent to the provider to be handled
 * {
 *   "uuid": "b2650836-b281-4ea5-9474-89312cbe8f51",
 *   "cartUpdated": new Date(), // this is a date object that indicates when the cart was last updated
 *   "cartCreatedTime": new Date(), // this is a date object that indicates when the cart was created
 *   "cartExpirationTime": new Date(), // this is a date object that indicates when the cart will expire
 *   "fieldColors": {}, // this is an object that contains the colors of the fields in the purchase, mostly internal
 *   "tab": "d7700243", // this is the tab id that the purchase was sent from
 *   "row": null, //  the rows of the tickets in the purchase
 *   "section": null, // the section of the tickets in the purchase
 *   "seats": null, // the seats of the tickets in the purchase
 *   "event": null, // the event name
 *   "venue": null, //  the venue name
 *   "quantity": null, // the quantity of tickets in the purchase
 *   "currency": null, // the currency of the purchase (USD, CAD, etc)
 *   "total": null, // the total of the purchase
 *   "fees": null, // the fees of the purchase
 *   "tax": null, // the tax of the purchase
 *   "costPerTicket": null, // the cost per seat of the purchase (to be renamed to costPerSeat)
 *   "dateTime": null, // the date and time of the event
 *   "oddEven": false, // this is a flag that indicates that the tickets are odd/even
 *   "deliveryMethod": null, // the delivery method of the purchase
 *   "isInsured": null, // this is a flag that indicates that the purchase is insured
 *   "marketplace": null, // the marketplace that the purchase was sent from
 *   "feeAndCostPerTicket": null, // the fees and cost per seat of the purchase (to be renamed to feeAndCostPerSeat)
 *   "ticketType": null, // the ticket type of the purchase
 *   "feesPerTicket": null // the fees per seat of the purchase (to be renamed to feesPerSeat)
 *   "orderNumber": null, // the order number of the purchase
 * }
 */

/**
 * This is an example of a service that you would create to send messages to your service
 * the constructor is called with the provider's state object and the jancy object
 */
class ExampleNamathPurchaseProvider {
  constructor(jancy, { key, providerName, instance_id } = {}) {
    this.jancy = jancy
    console.log(providerName, key, instance_id)
    this.name = providerName || `This example name`
    this.key = key //could be a key or token, but you are in control of these variables
    this.instance_id = instance_id
    this.type = 1 // this is the type of provider, 1 is a purchase provider
  }
  getName() {
    return this.name
  }
  getInfo() {
    return `Some friendly info about this provider will be displayed in namath`
  }
  /**
   * Send the cart to where ever you want to send it. The UI test button will call this function
   * @param {*} param0 - {cart is the cart object with all the sale info
   * tab is the jancy tab object that the cart was sent from,
   * respFunction is a callback that you call when you get a response from the provider
   * }
   */
  sendPurchaseOrder({cart, tab}) {
    //you need to send these args to myMessageAPI.sendPurchase
    let args = {
      cart: cart
    }
    myMessageAPI.sendPurchase({key:this.key}, args)
    return true
  }
  /** Return an object that can be fed back into the constructor to
  * recreate this provider. This is needed to restore the provider 
  * after Jancy restarts
  */
  getState() {
    return  {
      providerName: this.name,
      key: this.key,
      instance_id: this.instance_id,
      type: this.type
    }
  }
  editProvider(jancy, browserWindow, provider) {
    if (!provider) {
      console.error('No provider to edit')
      return
    }
    providerDialog(jancy, browserWindow, provider, true)
  }
}

/**
 * This dialog will be shown to the user when they click the '+' button in namath.
 * In it you should display values that allows the user to choose the specifics of your service provider
 * needed to send namath carts.
 * It's invocation is handled in the provider factory
 * @param {*} jancy (Jancy)
 * @param {*} browserWindow (BrowserWindow) 
 * @param {*} provider (NamathProvider): optional - for editing an existing provider (namath isn't ready for this yet)
 */

function providerDialog (jancy, browserWindow, provider=null, edit=false) {

  let providerWindow = this.jancy.dialogFactory.create(
    browserWindow,
    {
      width: 400,
      height: 150,
      title: provider ? `Edit ${ provider.getName() }` : 'Configure Example Namath Purchase Provider'
    },
    {
      centerRelativeToParent: true
    }
  )

  jancy.actionRegistry.register("example-namath-provider:save", (args, sender) => {
    /* args is the provider state object essentially
    args = {
      key: '1234',
      providerName: 'My Provider Name',
      instance_id: '1234'
    }
    */
   if (!provider) {
    args.instance_id = '1234' //this is a uuid that you generate and in this example can be used to identify the provider
   }
    const namath = jancy.getInterface('namathAPI')
    if (namath) {
      console.log(args)
      if (edit) {
        Object.assign(provider, args)
        namath.editProvider(provider)
      }
      else {
        namath.createProvider(ExampleNamathPurchaseProviderFactory, args)
      }
    }
  })

  providerWindow.on('ready-to-show', () => {

    const css = `
      p {
        padding: 5px 0;
      }
      .input-textfield {
        flex-grow: 1;
      }
      .button-container {
        width: 100%;
        justify-content: flex-end;
      }
    `

    providerWindow.webContents.insertCSS(css)

    const html = `
      <div class="block my-content">
        <div class="inline-block">
          <label class="input-label">Key</label>
          <input class="input-textfield" name="key" value="${ provider ? provider.key : ""}" />
        </div>
        <div class="inline-block">
          <label class="input-label">Name</label>
          <input class="input-textfield" name="providerName" value="${ provider ? provider.name : ""}" />
        </div>
        <div class="inline-block button-container">
          <button class="button" onclick="window.close()">Cancel</button>
          <button class="button" onclick="window.onSave()">${ provider ? "Update" : "Add" }</button>
        </div>
      </div>
    `
    // this is the code that will be executed in the browser window, it will set up the html and JS needed for the dialog
    const code = `
      (function () {
        window.onSave = (event) => {
          const key = document.body.querySelector('input[name="key"]').value
          const providerName = document.body.querySelector('input[name="providerName"]').value
          if (key.trim().length > 0 && providerName.trim().length > 0) {
            window.jancyAPI.dispatchAction("example-namath-provider:save", {
              key,
              providerName
            })
            window.close()
          }
        }
        document.body.innerHTML = \`${html}\`
      })()
    `

    providerWindow.on('close', () => {
      jancy.actionRegistry.unregister("example-namath-provider:save")
    })

    providerWindow.webContents.executeJavaScript(code)
    providerWindow.show()
  })
}
/**
 * This is an example of a class that you would create to send messages to your service. E.G. this is
 * what talks to Discord or Slack or whatever service you are trying to send messages to.
 * 
 * The instance of your Provider you create can call this to send messages to your service.
 * Alternatively, you can just call your service from your Provider directly.
 */
class MyMessageAPI extends EventEmitter {
  
  constructor(jancy) {
    super()
    this.jancy = jancy
    this.purchases = []
  }
  sendPurchase({key}, {cart, wantsResponse}) {
    console.log('purchase sent to with key', key)
    this.purchases.push(cart)
  }
}

module.exports = {

  jancy_props: {
    registryVersion: 1
  },

  /* --------------------------------------------------------------------------
  ** Called by the pluginRegistry when we are loaded.
  ** ------------------------------------------------------------------------*/
  jancy_onInit(jancy, enabled) {
    
    myMessageAPI = new MyMessageAPI(jancy)

    jancy.getInterfaceAsync('namathAPI').then((namath) => {
      namath.addFactory(ExampleNamathPurchaseProviderFactory)
    })

    jancy.registerInterface('myMessageAPI', myMessageAPI)
  },
}
