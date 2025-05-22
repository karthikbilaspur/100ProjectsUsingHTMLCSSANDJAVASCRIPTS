def essRecursive(N):
    cache = {1:1, 2: 3}
    def _essRecursive(n):
        if n in cache:
            return cache[n]
        maxOdd = n+(n&1)-1
        weights = [(n//2 , 2), (1,4), (maxOdd//2, 1), (maxOdd//2+1, -3)]
        tot = sum(_essRecursive(idx)*weight for idx, weight in weights)
        cache[n] = tot
        return tot
    return _essRecursive(N)

print(essRecursive(10**12))
