# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["backend/JewelleryApi.csproj", "backend/"]
RUN dotnet restore "backend/JewelleryApi.csproj"

# Copy full backend source and publish
COPY backend/ backend/
WORKDIR "/src/backend"
RUN dotnet publish "JewelleryApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "JewelleryApi.dll"]
