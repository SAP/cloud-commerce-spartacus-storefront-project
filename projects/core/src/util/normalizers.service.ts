import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Normalizer<S, T> {
  normalize(source: S, target?: T): T;
}

@Injectable({
  providedIn: 'root',
})
export class NormalizersService {
  constructor(private injector: Injector) {}

  private normalizers: Map<
    InjectionToken<Normalizer<any, any>>,
    Normalizer<any, any>[]
  > = new Map();

  private getNormalizers<S, T>(
    injectionToken: InjectionToken<Normalizer<S, T>>
  ): Normalizer<S, T>[] {
    if (!this.normalizers.has(injectionToken)) {
      const normalizers = this.injector.get<Normalizer<S, T>[]>(
        injectionToken,
        []
      );
      if (!Array.isArray(normalizers)) {
        console.warn(
          'Normalizers must be multi-provided, please use "multi: true" for',
          injectionToken.toString()
        );
      }
      this.normalizers.set(injectionToken, normalizers);
    }

    return this.normalizers.get(injectionToken);
  }

  /**
   * Will return true if normalizers for specified token were provided
   */
  hasNormalizers<S, T>(
    injectionToken: InjectionToken<Normalizer<S, T>>
  ): boolean {
    const normalizers = this.getNormalizers(injectionToken);
    return Array.isArray(normalizers) && normalizers.length > 0;
  }

  /**
   * Pipeable operator to apply normalizer logic in a observable stream
   */
  pipeable<S, T>(
    injectionToken: InjectionToken<Normalizer<S, T>>
  ): OperatorFunction<S, T> {
    if (this.hasNormalizers(injectionToken)) {
      return map((model: any) => this.normalizeSource(model, injectionToken));
    } else {
      return (observable: Observable<any>) => observable as Observable<T>;
    }
  }

  /**
   * Apply normalization logic specified by injection token to source data
   */
  normalize<S, T>(
    source: S,
    injectionToken: InjectionToken<Normalizer<S, T>>
  ): T {
    if (this.hasNormalizers(injectionToken)) {
      return this.normalizeSource(source, injectionToken);
    } else {
      return source as any;
    }
  }

  private normalizeSource<S, T>(
    source: S,
    injectionToken: InjectionToken<Normalizer<S, T>>
  ): T {
    return this.getNormalizers(injectionToken).reduce(
      (target, normalizer) => {
        return normalizer.normalize(source, target);
      },
      undefined as T
    );
  }
}
