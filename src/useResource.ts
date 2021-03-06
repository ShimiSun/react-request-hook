import {useEffect, useState, useCallback} from 'react';
import {Canceler} from 'axios';
import {useRequest} from './useRequest';
import {
  Payload,
  RequestError,
  Request,
  RequestDispatcher,
  Arguments,
} from './request';

export type UseResourceResult<TRequest extends Request> = [
  {
    data: Payload<TRequest> | null;
    error: RequestError | null;
    isLoading: boolean;
    cancel: Canceler;
  },
  RequestDispatcher<TRequest>
];

export function useResource<TRequest extends Request>(
  fn: TRequest,
  defaultParams?: Arguments<TRequest>,
): UseResourceResult<TRequest> {
  const [{clear, hasPending}, createRequest] = useRequest(fn);
  const [error, setError] = useState<RequestError | null>(null);
  const [data, setData] = useState<Payload<TRequest> | null>(null);

  const request = useCallback((...args: Arguments<TRequest> | any[]) => {
    clear('A new request has been made before completing the last one');
    const {ready, cancel} = createRequest(...(args as Arguments<TRequest>));
    ready()
      .then(data => {
        setData(data);
      })
      .catch((error: RequestError) => {
        if (!error.isCancel) {
          setError(error);
        }
      });
    return cancel;
  }, []);

  useEffect(() => {
    let canceller: Canceler;
    if (defaultParams) {
      canceller = request(...defaultParams);
    }
    return () => {
      if (canceller) {
        canceller();
      }
    };
  }, defaultParams);

  return [
    {
      data,
      error,
      cancel: clear,
      isLoading: hasPending,
    },
    request,
  ];
}
