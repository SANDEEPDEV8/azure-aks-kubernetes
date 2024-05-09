# Kubernetes - PODs

## Step-01: PODs Introduction

- What is a POD ?
- What is a Multi-Container POD?

## Step-02: PODs Demo

### Get Worker Nodes Status

- Verify if kubernetes worker nodes are ready.

```
# Configure Cluster Creds (kube config) for Azure AKS Clusters
# aksdemo1 is cluster name
# this enables  access to kube cluster from local desktop. this updates credentials in .kube/config file
az aks get-credentials --resource-group aks-rg1 --name aksdemo1

# Get Worker Node Status
kubectl get nodes

# Get Worker Node Status with wide option
kubectl get nodes -o wide
```

### Create a Pod

- Create a Pod

```
# Template
kubectl run <desired-pod-name> --image <Container-Image>

# Replace Pod Name, Container Image
kubectl run my-first-pod --image stacksimplify/kubenginx:1.0.0
```

### List Pods

- Get the list of pods

```
# List Pods
kubectl get pods

# Alias name for pods is po
kubectl get po
```

### List Pods with wide option

- List pods with wide option which also provide Node information on which Pod is running

```
kubectl get pods -o wide
```

### What happened in the backgroup when above command is run?

1. Kubernetes created a pod
2. Pulled the docker image from docker hub
3. Created the container in the pod
4. Started the container present in the pod

### Describe Pod

- Describe the POD, primarily required during troubleshooting.
- Events shown will be of a great help during troubleshooting.

```
# To get list of pod names
kubectl get pods

# Describe the Pod
kubectl describe pod <Pod-Name>
kubectl describe pod my-first-pod
```

- shows : image name, status (running), age, port (default 80), events occured

* events
  - default scheduler successfully assignes the xx image to aks-agent pool worker node
  - kubelet pulls the image
  - creates and starts container

### Access Application

- Currently we can access this application only inside worker nodes.
- To access it externally, we need to create a **NodePort or Load Balancer Service**.
- by default in azure you can use load banlancer service. cant use node port service by default. you need to enable node public ip config for every node inside AKS cluster. its in preview mode.
- so when you create aks cluster it automatically creates load balancer service in azure
- **Services** is one very very important concept in Kubernetes.

```
kubectl get pods -o wide
```

- give the internal ip of the pod. this is accessible only with in kube clusted.

* to access externally use services

### Delete Pod

```
# To get list of pod names
kubectl get pods

# Delete Pod
kubectl delete pod <Pod-Name>
kubectl delete pod my-first-pod
```

## Step-03: Load Balancer Service Introduction

- What are Services in k8s?
- What is a Load Balancer Service?
- How it works?

---

#### slide>> Kubernetes – Service - LoadBalancer

## Step-04: Demo - Expose Pod with a Service

- Expose pod with a service (Load Balancer Service) to access the application externally (from internet)
- **Ports**
  - **port:** Port on which node port service listens in Kubernetes cluster internally
  - **targetPort:** We define container port here on which our application is running.
- Verify the following before LB Service creation
  - Azure Standard Load Balancer created for Azure AKS Cluster
    - Frontend IP Configuration
    - Load Balancing Rules
  - Azure Public IP : this IP is used for kubectl commands. via this traffic from your kubectl goes to your respective cluster
  * load balancer > bankend pools > have kube cluster

```
# Create  a Pod
kubectl run <desired-pod-name> --image <Container-Image>
kubectl run my-first-pod --image stacksimplify/kubenginx:1.0.0

# Expose Pod as a Service
kubectl expose pod <Pod-Name>  --type=LoadBalancer --port=80 --name=<Service-Name>
kubectl expose pod my-first-pod  --type=LoadBalancer --port=80 --name=my-first-service

kubectl get pods

# Get Service Info
kubectl get service
kubectl get svc

# clusterIp > internal  | externalIp > internet

# Describe Service
kubectl describe service my-first-service

# Access Application
http://<External-IP-from-get-service-output>
```

- Verify the following after LB Service creation
  - Azure Standard Load Balancer created for Azure AKS Cluster
    - Frontend IP Configuration > new public ip
    - Load Balancing Rules > new load balancing rule
      - health probe has the node port of that sevice
  - Azure Public IP > another public ip created for new service
- View the resources in Azure AKS Cluster - Resources section from Azure Portal Management Console

```
# shows all in default namespace
kubectl get all
```

goto > kubernetes services > aksdemo1 > namespaces

this namespaces list not showing after integrated with Azure AD for auth. open issue

```
kubectl list namespaces
```

#### workloads:

- deployment, pods, replica sets, stateful sets, daemon sets, jobs, cron jobs

* go to pods > my-first-pod> info about pod, volumes, yaml manifest
* go to service> my-first-service

## Step-05: Interact with a Pod

### Verify Pod Logs

```
# Get Pod Name
kubectl get po

# Dump Pod logs
kubectl logs <pod-name>
kubectl logs my-first-pod

# Stream pod logs live (hit website) with -f option and access application to see logs
kubectl logs <pod-name>
kubectl logs -f my-first-pod
```

- **Important Notes**
  - Refer below link and search for **Interacting with running Pods** for additional log options
  - Troubleshooting skills are very important. So please go through all logging options available and master them.
  - **Reference:** https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### Connect to Container in a POD

- **Connect to a Container in POD and execute commands**

```
# Connect to Nginx Container in a POD
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it my-first-pod -- /bin/bash

# Execute some commands in Nginx container
ls
cd /usr/share/nginx/html
cat index.html
exit
```

- **Running individual commands in a Container**

```
kubectl exec -it <pod-name> -- env

# Sample Commands
kubectl exec -it my-first-pod -- env
kubectl exec -it my-first-pod -- ls
kubectl exec -it my-first-pod -- cat /usr/share/nginx/html/index.html
```

## Step-06: Get YAML Output of Pod & Service

### Get YAML Output

```
# Get pod definition YAML output
kubectl get pod my-first-pod -o yaml

# Get service definition YAML output
kubectl get service my-first-service -o yaml
```

## Step-07: Clean-Up

```
# Get all Objects in default namespace
kubectl get all

# Delete Services
kubectl delete svc my-first-service

# Delete Pod
kubectl delete pod my-first-pod

# Get all Objects in default namespace
kubectl get all
```
