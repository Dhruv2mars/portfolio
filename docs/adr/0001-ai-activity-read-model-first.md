# AI Activity is a read model; ingestion comes later

Home needs an AI Activity heatmap for brand proof, but the real usage pipeline is undecided. We treat AI Activity as a pure front-end read model (daily token series + summary stats) rendered from fixture/hardcoded data first, with no provider secrets in the public app. Ingestion (export, API, or manual sync) is a later change that feeds the same shape.
