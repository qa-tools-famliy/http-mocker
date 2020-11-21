import request from '@/utils/request';

export async function queryRule(params) {
    return request('/api/mock_rules?page_num=' + params.pageNum + "&page_size=" + params.pageSize, {
        method: 'GET',
        data: {},
    });
}

export async function addRule(params) {
    return request('/api/mock_rules', {
        method: 'POST',
        data: { ...params },
    });
}
