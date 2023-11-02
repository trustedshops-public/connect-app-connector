import { h, FunctionComponent } from 'preact'
import { lazy, Suspense } from 'preact/compat'
import Spinner from '@/components/layouts/spinner'

type LazyLoadingProps = {
  importComponent: () => Promise<{ default: FunctionComponent<any> }>
  props?: any
}

export const LazyLoading: FunctionComponent<LazyLoadingProps> = ({ importComponent, props }) => {
  const LazyComponent = lazy(importComponent)

  return (
    <Suspense fallback={<Spinner />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}
