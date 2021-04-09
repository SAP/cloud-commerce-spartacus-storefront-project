import { OccConfig } from '../../config/occ-config';

export const defaultOccSiteContextConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        languages: 'languages',
        currencies: 'currencies',
        countries: 'countries',
        regions:
          'countries/${isoCode}/regions?fields=regions(name,isocode,isocodeShort)',
        baseSites:
          'basesites?fields=DEFAULT,baseSites(defaultPreviewCatalogId,defaultPreviewCategoryCode,defaultPreviewProductCode,urlEncodingAttributes)',
        /**
         * TODO(#11515): in 4.0, replace the value of `baseSites` with `baseSitesForConfig` and remove `baseSitesForConfig`.
         */
        baseSitesForConfig:
          'basesites?fields=baseSites(uid,defaultLanguage(isocode),urlEncodingAttributes,urlPatterns,stores(currencies(isocode),defaultCurrency(isocode),languages(isocode),defaultLanguage(isocode)),theme,defaultPreviewCatalogId,defaultPreviewCategoryCode,defaultPreviewProductCode)',
      },
    },
  },
};
