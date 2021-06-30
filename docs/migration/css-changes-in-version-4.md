---
title: Changes to Styles in 4.0
---

## Changes in Checkout Components

- `cx-product-variants` selector has been moved to corresponding feature-lib `@spartacus/product`.

## Change in Configurator Attribute Type Components

- `cx-quantity` selector has been added to achieve a consistent styling.

## Changes in Configurator Product Title Component

- `width` set to 80% on `%cx-configurator-product-title` to use only 80% of the configuration product title width.

- `button` instead of the anchor link on `%cx-configurator-product-title`.

- `padding` set to 16px/ 32px on `%cx-configurator-product-title` for `cx-details` selector to align spacing depending on the screen size.

- `cx-configurator-image` mixin has been defined on `%cx-configurator-product-title` for `cx-details-image` selector to achieve a consistent styling.

- `cx-configurator-truncate-content` mixin has been added on `%cx-configurator-product-title` for `cx-detail-title`, `cx-code` and `cx-description` selectors to enable the truncation for the small widgets.

## Changes in Configurator Group Menu Component

- `cx-group-menu` class replaces `ul` element on `%cx-configurator-group-menu`.
- `cx-configurator-truncate-content` mixin has been added on `%cx-configurator-group-menu` for `span` selector to enable the configuration group title truncation for the small widgets.

## Changes in Configurator Form Component

- `width` set to 100% on `%cx-configurator-form` to use the whole width of the configuration form.

- `padding` set to 16px on `%cx-configurator-form` for `cx-group-attribute` to align the spacing between the configuration group attributes.

## Changes in Configurator Attribute Header Component

- `margin` set to 17px on `%cx-configurator-attribute-header` to align the spacing to the attribute header to the attribute type.

- `padding` set to 0px and `margin` to 17px on `%cx-configurator-attribute-type` to align the spacing between the configuration attribute types.

## Change in Configurator Attribute Drop-Down Component

- `padding` set to 1rem on `%cx-configurator-attribute-drop-down` for `cx-configurator-attribute-quantity` selector to define the spacing between the drop-down attribute type and the quantity counter.

## Change in Configurator Attribute Checkbox List Component

- `padding` set to 1rem on `%cx-configurator-attribute-checkbox-list` to define the spacing between the checkbox-list attribute type and the quantity counter.

## Change in Configurator Attribute Radio Button Component

- `padding` set to 1rem on `%cx-configurator-attribute-radio-button` to define the spacing between the radio-button attribute type and the quantity counter.

## Change in Configurator Previous Next Button Component

- `padding` set to 16px on `%cx-configurator-previous-next-buttons` to align the spacing between the configuration form and the bottom of the configuration.

## Change in Configurator Price Summary Component

- `padding` set to 16px on `%cx-configurator-price-summary` for cx-total-summary selector to align the spacing.

## Change in Configurator Footer Container Mixin

- `padding` set to 16px on `%cx-configurator-footer-container` mixin to align the spacing between the price summary and add-to-cart button.

## Change in Configurator Required Error Message Mixin

- `padding` set to 5px on `%cx-configurator-required-error-msg` mixin to add the spacing at the end of the cx-icon selector.

## Changes in Configurator Overview Form Component

- `padding` set to 0px on `%cx-configurator-overview-form` to fix inconsistent spacings in the configuration overview form.

- `padding` set to 20px and `margin` to 0px on `%cx-configurator-overview-form` for `cx-group` selector to align spacing between the configuration overview groups.

- `padding` set to 32px/16px on `%cx-configurator-overview-form` for `h2` selector to align spacing around the configuration overview group titles.

- `cx-configurator-truncate-content` mixin has been added on `%cx-configurator-overview-form` for `span` selector to enable the overview group title truncation for the small widgets.

- `padding` set to 32px on `%cx-configurator-overview-form` for `cx-attribute-value-pair` selector to align spacing between the configuration overview attribute value pairs.

- `display` set to `none / inline` and `visibility` to `hidden` on `%cx-configurator-overview-form` for `cx-attribute-value-pair` selector to define the visibility for the configuration overview attribute value label.

- `padding` set to 20px on `%cx-configurator-overview-form` for `cx-no-attribute-value-pairs` selector to align spacing between the configuration overview form and the container which is shown when there are no results including a link for removing filter(s).

- `font-size` set to 1.25rem on `%cx-configurator-overview-form` for `topLevel` selector to adjust the attribute header according to the new styling requirement

- `font-weight` set to 700 on `%cx-configurator-overview-form` for `topLevel` selector to adjust the attribute header according to the new styling requirement

- `border-bottom` set to solid 1px var(--cx-color-light) on `%cx-configurator-overview-form` for `topLevel` selector to create the bottom border of the attribute header

- `border-top` set to solid 1px var(--cx-color-light) on `%cx-configurator-overview-form` for `topLevel` selector to create the top border of the attribute header

- `border-left-style` set to none on `%cx-configurator-overview-form` for `topLevel` selector to achieve top-bottom border

- `border-right-style` set to none on `%cx-configurator-overview-form` for `topLevel` selector to achieve top-bottom border

- `background` set to none on `%cx-configurator-overview-form` for `topLevel` to make the header background transparent

- `text-transform` set to none on `%cx-configurator-overview-form` for `topLevel` to prevent the header form transforming to uppercase

- `margin-bottom` set to -60px on `%cx-configurator-overview-form` for `subgroupTopLevel` to eliminate the space between the top-level attribute header and its subgroups

- `background-color` set to var(--cx-color-background) on `%cx-configurator-overview-form` for `cx-group h2` to set the background color of the subgroup headers

- `font-size` set to 1rem on `%cx-configurator-overview-form` for `cx-group h2` to specify the font size of the subgroup headers

- `text-transform` set to uppercase on `%cx-configurator-overview-form` for `cx-group h2` to transform the subgroup header into uppercase

## Changes in Configurator Overview Attribute Component

- `width` set to 40% on `%cx-configurator-overview-attribute` for `cx-attribute-value` selector to use only 40% of the width for the small widgets.

- `width` set to 60% on `%cx-configurator-overview-attribute` for `cx-attribute-label` selector to use only 60% of the width for the small widgets.

- `width` set to 60% on `%cx-configurator-overview-attribute` for `cx-attribute-label` selector to use only 60% of the width for the small widgets.
- `font-weight` set to 600 on `%cx-configurator-overview-attribute` for `cx-attribute-value` to make the attribute values bold

## Changes in Product Configurator Card Component

- `.cx-card-title` class added (a11y)
- `.deselection-error-message` class added
- `display` set to inline-block on `%cx-configurator-attribute-product-card`for `&.deselection-error-message` to prevent line break in the deselection error message 
- `width` set to 80% on `%cx-configurator-attribute-product-card`for `&.deselection-error-message` to set the element's box size and prevent line break
- `flex-wrap` set to wrap on `%cx-configurator-attribute-product-card` for `.cx-product-card-selected` to align the deselection error to the desired position
- `padding-top` set to 5px  on `%cx-configurator-attribute-product-card` for `.deselection-error-message` to create space between value description and the error message 
- `color` set to var(--cx-color-danger) on `%cx-configurator-attribute-product-card` for `.deselection-error-message` to signal the message as error message
- `padding-right` set to 5px on `%cx-configurator-attribute-product-card` for `.deselection-error-message-symbol` to create space between the message and the 'error' icon

## Change in Cart Item Component

- `h2` added under `.cx-name` to account for the change in markup template for improved screen reader support (a11y)

## Changes in Order Summary Component 

- `h4` changed to `h3` to account for the change in markup template for improved screen reader support (a11y)

## Changes in Review Submit Component

- `type(3)` added `.cx-review-title` class to retain previous style after changes in the markup template

## Changes in `_index.scss` 

- new component `cx-page-header` added to allow list (a11y)
## Changed in Category Navigation Component 

- `h5` changed to `span` to account for the change in markup template for improved screen reader support (a11y) 
- `nav.is-open > h5` changed to `li.is-open > span` to remove headings from category navigation for improved categorization in screen reader elements dialog (a11y)

## Changes in Footer Navigation Component 

- `h5` changed to `span` under `.flyout`, `@include media-breakpoint-down(md)`, `nav` and `nav >` to account for the change in markup template for improved screen reader support (a11y)


## Changes in Carousel Component

- `h3` changed to `h2` to account for the change in markup template for improved screen reader support (a11y)

## Changes in Product Carousel Component

- `h4` changed to `h3` to account for the change in markup template for improved screen reader support (a11y)

## Changes in Product List Item Component 

- `h2` added to account for the change in markup template for improved screen reader support (a11y)

## Changes in Wish List Item Component 

- `h2` added to account for the change in markup template for improved screen reader support (a11y)

## Changes in Checkout Media Style Component 

- `type(3)` and `font-weight` added to retain existing styling after change in markup template for improved screen reader support (a11y)

## Changes in `_index.scss` Changes 

- `_screen-reader.scss` added which will contain screen reader specific styles (a11y)

## Changes in `_screen-reader.scss` Changes 

- `.cx-visually-hidden` class added. This class can be utilized to hide elements specific for Screen Reader announcement and narration (a11y)

## Changes in `_list.scss` Changes 

- `.cx-table td .text` and `.cx-table td a` padding-inline-start removed to align cx-org table items with head labels.

## Changes in `buttons.scss` Changes 

- `text-transform: var(--cx-button-text-transform)` is changed to `text-transform: var(--cx-text-transform)` to accommodate for theme changes. 

## Changes in `_searchbox.scss` Changes 

- `cx-icon.reset` is changed to `button.reset`
- `.dirty cx-icon.search` is changed to `.dirty div.search` 
- `:not(.dirty) cx-icon.reset` is changed to `:not(.dirty) button.reset` 
- `cx-icon` is changed to `button, div.search` and `cursor: pointer`  is removed.
- `.reset` is changed to `.reset cx-icon`
- `h4.name` is changed to `div.name`
