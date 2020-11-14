import { queryRule } from '@/services/rule';
import {
    message
} from 'antd';


const RuleModel = {
    namespace: 'rule',

    state: {
        ruleList: [],
    },

    effects: {
        *fetchRules({body}, { call, put }) {
            const response = yield call(queryRule, {
                "latest_time_range": 600,
                "host_ip": body.host_ip
            });
            if (response.code === 200) {
                message.success(response.message);
            }
            else {
                message.error(response.message);
            }
            yield put({
                type: 'saveRules',
                ruleList: response.data,
            });
        },
    },

    reducers: {
        saveRules(state, action) {
            return {
                ...state,
                ruleList: action.ruleList
            };
        },
    },
};

export default RuleModel;
