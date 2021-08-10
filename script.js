import http from 'k6/http';
import { sleep, check } from 'k6';

export default function () {
  // const rnd = Math.floor(Math.random() * 100);
  const response = http.get('http://localhost:4200/api/qa/questions/1/answers');
  // console.log('Response time was ' + String(response.timings.duration) + ' ms');
  check(response, {
    "is status 200": (r) => r.status === 200,
  });
}

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 20,
      maxVUs: 50,
    },
  },
};

// export default function () {
//   http.get('http://localhost:4200/api/qa/questions/1');
//   sleep(10);
// }
