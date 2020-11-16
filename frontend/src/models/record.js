import { queryRecord } from '@/services/record';
import {
    message
} from 'antd';


const RecordModel = {
    namespace: 'record',

    state: {
        recordList: [],
        recordListTotal: 0
    },

    effects: {
        *fetchRecords({body}, { call, put }) {
            const response = yield call(queryRecord, {
                "latest_time_range": 600,
                "host_ip": body.host_ip
            });
            yield put({
                type: 'saveRecords',
                recordList: response.data.record_list,
                recordListTotal: response.data.total
            });
        },
    },

    reducers: {
        saveRecords(state, action) {
            return {
                ...state,
                recordList: action.recordList,
                recordListTotal: action.recordListTotal,
            };
        },
    },
};

export default RecordModel;
