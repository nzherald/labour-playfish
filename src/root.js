import _ from "lodash"
import $ from "jquery"
import * as d3 from "d3"
import * as d3jetpack from "d3-jetpack"

import PlayFish from "./lib/playfish.js"
import rawData from "./data/comparison.csv"
import HTML from "./root.html"
import "./base.less"
import "./root.less"


class Main {
    constructor () {
        $(HTML).appendTo("#root")
        const PF = new PlayFish({
            container: "#root .mainvis",
            scale: {
                x: d3.scalePoint(),
                y: d3.scaleLinear(),
                c: d3.scaleOrdinal(["#2F4285", "#B22A2E", "#7D1A6E"])
                     .domain(["Pre-Election Forecast", "Labour's Plan", "Budget 2018"])
            },
            axis: {
                x: d3.axisBottom().tickPadding(32).tickSize(0),
                y: d3.axisLeft().ticks(3).tickPadding(16).tickSize(4)
            },
            format: {
                val: (d) => d3.format("$.3s")(d).replace(/G/, "B")
            }
        })

        let data = this.cleanData(rawData)
        data = _.filter(data, d => d.series === "Budget 2018" || d.series === "Labour's Plan")
        this.setSelect(data)

        $(".titlebox select")
            .on("change", function (d) {
                const measure = $(this).val(),
                      curr = _.filter(data, {measure})
                const title = curr[0].measure,
                      diffVal = _.sumBy(curr[1].data, "val") - _.sumBy(curr[0].data, "val"),
                      diffStr = PF.format.val(Math.abs(diffVal)) + ((diffVal > 0) ? " more" : " less")
                PF.setData(curr)
                d3.select("#diffStr").html(diffStr)
                d3.select("#measureName").html(title)
            })
            .val("Operational allowance")
            .trigger("change")

        this.fadeOut()
    }

    setSelect (data) {
        _(data).map("measure").uniq().each(d => {
            d3.select(".titlebox select")
              .append("option")
              .at("value", d)
              .html(d)
        })
    }

    cleanData (rawData) {
        console.log("Raw data:", rawData)
        const years = ["2018/19", "2019/20", "2020/21", "2021/22"]
        return _.map(rawData, d => {
            return {
                measure: d.measure,
                series: d.scenario,
                data: _.map(years, y => {
                    return {period: y, val: d[y] * 1000000}
                })
            }
        })
    }

    fadeOut (b) {
        $("#loading").fadeTo(600, 0.01, () => {
            $("#loading").remove()
            console.log("Loader removed.")
            if (b) b()
        })
    }
}

new Main()
