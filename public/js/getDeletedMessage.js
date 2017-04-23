/**
 * Created by shinan on 2017/4/23.
 */
const $ = window.$;
const GET_DELETED_MESSAGE = '/show/getDeletedMessage';

const getDeletedMessage = (ids) => {
  return $.ajax({
    url: GET_DELETED_MESSAGE,
    data: {
      ids: JSON.stringify(ids)
    }
  })
}

module.exports = getDeletedMessage
