
const socials = require('../data/socials')
const products = require('../data/products')

describe('Best buy', () => {
    before(browser => {
        browser
            .maximizeWindow()
            .url('https://www.bestbuy.com/')
            .click("a.us-link")
            .waitForElementVisible('.c-close-icon.c-modal-close-icon', 8000)
            .click('.c-close-icon.c-modal-close-icon')
    })

    after(browser => {
        browser.end()
    })

    test('Social links', browser => {
        browser.perform(done => {
            socials.forEach(({ selector, url }) => {
                browser
                    .waitForElementVisible(`*[data-lid="${selector}"]`, 8000)
                    .click(`*[data-lid="${selector}"]`)
                    .windowHandles(result => {
                        handle = result.value[1];
                        browser.switchWindow(handle);
                    })
                    .assert.urlEquals(url)
                    .closeWindow()
                    .windowHandles(result => {
                        handle = result.value[0];
                        browser.switchWindow(handle);
                    })
            })
            done()
        })
    })

    test('Cart behaviour', browser => {
        browser.perform(done => {
            const prices = []
            const ids = []

            for (let iteration = 0; iteration < 5; iteration++) {
                browser.perform(done => {
                    browser.perform(done => {
                        products.forEach((product, index) => {
                            browser
                                .url('https://www.bestbuy.com/')
                                .setValue('#gh-search-input', product)
                                .click('.header-search-button')
                                .waitForElementVisible('.priceView-customer-price')
                                .getText('.priceView-customer-price', (result) => {
                                    const price = parseFloat(result.value.replace('$', '').replace(',', ''))
                                    prices.push(price)
                                })
                                .getAttribute('.shop-sku-list-item .list-item', 'data-sku-id', (result) => {
                                    ids.push(result.value)
                                    console.log("Added product to cart", result.value)
                                })
                                .waitForElementVisible('.add-to-cart-button')
                                .pause(2000)
                                .click('.add-to-cart-button')
                                .pause(2000)
                                // .waitForElementVisible('.dot', 8000)
                                // .getText('.dot', result => {
                                //     console.log("Number of items in cart", result.value)
                                //     browser.assert.equal(result.value, index + iteration + 1)
                                // })
                                .url('https://www.bestbuy.com/cart')
                                .getText('.price-summary__total-value', (result) => {
                                    const price = parseFloat(result.value.replace('$', '').replace(',', ''))
                                    console.log("Current total price of cart", price)
                                })
                        })
                        done()
                    })

                    browser.saveScreenshot(`./reports/screenshot-cart-${iteration}.png`)

                    // clear all cart items but the product with highest price
                    browser.perform(done => {
                        const highestPrice = Math.max(...prices)
                        products.forEach((product, index) => {
                            if (prices[index] !== highestPrice) {
                                browser
                                    .perform(done => {
                                        console.log('Removing', product)
                                        done()
                                    })
                                    .url('https://www.bestbuy.com/cart')
                                    .pause(2000)
                                    // .waitForElementVisible(`*[auto-test-sku="${ids[index]}"] a.cart-item__remove`, 8000)
                                    .click(`*[auto-test-sku="${ids[index]}"] a.cart-item__remove`)
                            } else {
                                console.log('As it has the highest price not removing', product)
                            }
                        })
                        done()
                    })
                    done()
                })
            }
            done()
        })

    });

});