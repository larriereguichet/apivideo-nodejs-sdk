const createCollection = item => ({
  currentPage = 1,
  pageSize = 100,
  itemsTotal,
}) => {
  const pagesTotal = Math.ceil(itemsTotal / pageSize);

  if (currentPage > pagesTotal) {
    throw new Error(`Page ${currentPage} doesn't exist.`);
  }

  const currentPageItems = currentPage === pagesTotal ? itemsTotal % pageSize : pageSize;
  return {
    data: Array.from(Array(currentPageItems)).fill(item),
    pagination: {
      currentPage,
      currentPageItems,
      itemsTotal,
      links: [
        {
          rel: 'self',
          uri: `https://ws.api.video/videos?currentPage=${currentPage}`,
        },
        {
          rel: 'first',
          uri: 'https://ws.api.video/videos?currentPage=1',
        },
        {
          rel: 'last',
          uri: `https://ws.api.video/videos?currentPage=${pagesTotal}`,
        },
      ],
      pageSize,
      pagesTotal,
    },
  };
};

module.exports = createCollection;
