# Spartacus migration - Bootstrap

1. Uninstall Bootstrap
   If the bootstrap package is still installed in your project, uninstall it to avoid conflicts. Use
   the following command:
   ```npm uninstall bootstrap```
2. Update `styles.scss`
   Modify the `styles.scss` file to integrate Spartacus styles along with Bootstrap. Proper import order is critical for
   styles to be applied correctly.
### Steps to Update:
1. Place the following import for styles-config at the top of the file:
       ```@import 'styles-config';```
2. Add Spartacus core styles first. Importing Spartacus styles before Bootstrap ensures core styles load as a
   priority.
3. Follow this by importing Bootstrap styles using the Bootstrap copy provided by Spartacus. Ensure the order of
   Bootstrap imports matches the sequence below for consistency.
4. Conclude with the Spartacus index styles.


   Final file structure should look like this:

```styles.scss
// ORDER IMPORTANT: Spartacus core first
@import '@spartacus/styles/scss/core';

// ORDER IMPORTANT: Bootstrap next
@import '@spartacus/styles/bootstrap-copy/scss/reboot';
@import '@spartacus/styles/bootstrap-copy/scss/type';
@import '@spartacus/styles/bootstrap-copy/scss/grid';
@import '@spartacus/styles/bootstrap-copy/scss/utilities';
@import '@spartacus/styles/bootstrap-copy/scss/transitions';
@import '@spartacus/styles/bootstrap-copy/scss/dropdown';
@import '@spartacus/styles/bootstrap-copy/scss/card';
@import '@spartacus/styles/bootstrap-copy/scss/nav';
@import '@spartacus/styles/bootstrap-copy/scss/buttons';
@import '@spartacus/styles/bootstrap-copy/scss/forms';
@import '@spartacus/styles/bootstrap-copy/scss/custom-forms';
@import '@spartacus/styles/bootstrap-copy/scss/modal';
@import '@spartacus/styles/bootstrap-copy/scss/close';
@import '@spartacus/styles/bootstrap-copy/scss/alert';
@import '@spartacus/styles/bootstrap-copy/scss/tooltip';

@import '@spartacus/styles/index';
```
