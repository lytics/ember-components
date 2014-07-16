### Component Names & Nesting

* `lio-toggle`
  * `lio-value` `value="true/false"`
* `lio-date-input`
  * `lio-text-field`
  * `lio-calendar`
* `lio-input` `type="text/password/numeric/email"`
  * `lio-text-field`
  * `lio-options`
    * `lio-option`
* `lio-multi-input`
  * `lio-text-field`
  * `lio-options`
    * `lio-option`
  * `lio-values`
    * `lio-value`
  * `lio-button` `action="add"`
  * `lio-button` `action="remove-all"`
* `lio-select`
  * `lio-value`
  * `lio-options`
    * `lio-option`
  * `lio-filter`
    * `lio-text-field`
    * `lio-button` `action="clear"`
* `lio-multi-select`
  * `lio-options`
    * `lio-option`
  * `lio-values`
    * `lio-value`
  * `lio-button` `action="select-all"`
  * `lio-button` `action="unselect-all"`
  * `lio-filter`
    * `lio-text-field`
    * `lio-button` `action="clear"`
* `lio-carousel`
  * `lio-contents`
    * `lio-content`
  * `lio-labels`
    * `lio-label`
  * `lio-button` `action="next"`
  * `lio-button` `action="previous"`
* `lio-progress`
  * `lio-content`
* `lio-tip`
  * `lio-label`
  * `lio-content`


### Directory Structure

* common/
  * text-field
  * options
  * option
  * values
  * value
  * contents
  * content
  * labels
  * label
  * button
  * filter

* input/
  * toggle
  * date-input
  * input
  * multi-input
  * select
  * multi-select

* display/
  * carousel
  * tip
  * progress
