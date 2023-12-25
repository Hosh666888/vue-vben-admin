import { createStore } from 'vuex';

export default createStore({
  state: {
    clickEntity: null,
  },
  mutations: {
    updateClickEntity(state, newEntity): void {
      state.clickEntity = {
        EEID: newEntity.EEID,
        rankId: newEntity.rankId,
      };
    },
  },
});
