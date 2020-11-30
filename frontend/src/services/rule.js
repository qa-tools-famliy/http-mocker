import request from '@/utils/request';

export async function queryRule(params) {
    console.log('debug params: ', params);
    let baseUrl = '/api/mock_rules?'
    if (params.pageNum) {
        baseUrl = baseUrl + 'page_num=' + params.pageNum + '&';
    }
    if (params.pageSize) {
        baseUrl = baseUrl + 'page_num=' + params.pageSize + '&';
    }
    if (params.url) {
        baseUrl = baseUrl + 'url=' + params.url + '&';
    }
    if (params.method) {
        baseUrl = baseUrl + 'method=' + params.method + '&';
    }
    if (params.source_ip) {
        baseUrl = baseUrl + 'source_ip=' + params.source_ip + '&';
    }
    return request(baseUrl, {
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

export async function deleteRule(params) {
    return request('/api/mock_rules', {
        method: 'DELETE',
        data: { ...params },
    });
}
