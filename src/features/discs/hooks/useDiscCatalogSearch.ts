import { useQuery } from '@tanstack/react-query'
import {
  searchDiscCatalog,
  type DiscCatalogSearchParams,
} from '../../../services/discCatalog.service'

export function useDiscCatalogSearch(params: DiscCatalogSearchParams) {
  return useQuery({
    queryKey: ['discCatalog', params],
    queryFn: () => searchDiscCatalog(params),
  })
}
