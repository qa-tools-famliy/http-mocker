import {
    queryRule,
    addRule,
} from '@/services/rule';
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
            const response = yield call(queryRule, body);
            yield put({
                type: 'saveRules',
                ruleList: response.data.rule_list,
                ruleTotal: response.data.total,
            });
        },
        *newRule({body}, { call, put }) {
            const response1 = yield call(addRule, body.inputData);
            if (response1.code === 200) {
                message.success(response1.message);
            }
            else {
                message.error(response1.message);
            }
            const response = yield call(queryRule, body.searchInfo);
            yield put({
                type: 'saveRules',
                ruleList: response.data.rule_list,
                ruleTotal: response.data.total,
            });
        },
    },

    reducers: {
        saveRules(state, action) {
            return {
                ...state,
                ruleList: action.ruleList,
                ruleTotal: action.ruleTotal,
            };
        },
    },
};

export default RuleModel;
